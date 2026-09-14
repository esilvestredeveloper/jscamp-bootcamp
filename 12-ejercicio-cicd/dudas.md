Buenas Mateo

En principio todo claro, aun así, te dejo algunas notas:

- La carpeta `.github` está en la raíz del repositorio y no dentro de `12-ejercicio-cicd`, porque GitHub solo ejecuta los workflows que están en `.github/workflows` de la raíz. Por eso en `05-ci.yml` uso `defaults.run.working-directory: 12-ejercicio-cicd` y la composite action instala las dependencias desde esa carpeta.
- He generado el `pnpm-lock.yaml` con pnpm 11, la misma versión que usa la action. Con el lockfile creado con pnpm 9 el `pnpm install --frozen-lockfile` fallaba en CI, porque pnpm 11 rechaza paquetes publicados hace menos de 24 horas.
- En `02-manual.yml` el input `environment` es de tipo `choice` y no `environment`; creo que es bastante más sencillo, al menos para la práctica.
- En `03-schedule.yml` el cron es `0 7 * * 1` porque GitHub usa UTC, así se ejecuta los lunes a las 9 en hora española (horario de verano).

**Respuestas:**

Hola crack! Excelente! Gracias por las aclaraciones, lo has hecho perfecto :)