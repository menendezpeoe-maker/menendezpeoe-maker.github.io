# Preguntas para un asesor jurídico (T11, 26 oct 2026)

Este documento **no decide nada jurídico**: recoge cómo funciona hoy Test 29N y las dudas que conviene consultar a un abogado (normativa digital, protección de datos y electoral). Las respuestas del asesor se anotan debajo de cada pregunta, con fecha.

## Cómo funciona hoy (hechos, comprobables en el código)
- **Qué es:** test político gratuito y neutral para las elecciones generales del 29 de noviembre de 2026, en https://test29n.es. No recomienda voto.
- **Alojamiento:** GitHub Pages (GitHub, Inc., EE. UU.). Web estática, sin servidor propio ni base de datos.
- **Datos del usuario:** sin registro ni cookies. Respuestas y provincia solo en el almacenamiento local del navegador. El enlace para compartir lleva las respuestas codificadas en la parte `#` de la dirección (no llega a ningún servidor salvo que el usuario lo comparta).
- **Medición:** GoatCounter (sin cookies). Cuenta solo pasos: inicio, test empezado, test terminado, compartir, reto a un amigo, clic en donar y «¿Te ha resultado útil? Sí/No». Recibe la web de procedencia, tamaño de pantalla y datos técnicos del navegador; nunca respuestas, provincia ni resultado.
- **Aportaciones voluntarias:** botones que abren PayPal y un enlace de pago de Stripe (Apple Pay/tarjeta). Bizum por Stripe, pendiente de aprobación. La web no recibe ni guarda datos de pago. Aportar no cambia nada del test.
- **Responsable:** se identifica públicamente solo con el seudónimo «Dery» y un correo de contacto (enlace `mailto:`). No figura nombre completo, NIF ni dirección.
- **Imágenes:** 17 fotos de líderes de Wikimedia Commons, con licencia y atribución; colores y siglas de los partidos, sin logotipos.
- **Calendario previsto:** nada que parezca encuesta ni promoción del 24 al 28 de noviembre; ninguna promoción el 28.

## 1. Normativa de servicios de la sociedad de la información (LSSI, Ley 34/2002)
1. ¿Recibir aportaciones voluntarias convierte la web en un servicio prestado «a título oneroso» o con actividad económica a efectos del art. 10 LSSI? Si es así, ¿qué datos de identificación hay que publicar (nombre o denominación, NIF, domicilio, correo)?
2. ¿Basta un seudónimo («Dery») y un correo, o es obligatorio el nombre completo? ¿Hay alguna forma admitida de no publicar el domicilio personal (por ejemplo, un apartado o domicilio profesional)?
3. ¿El pie de página actual («Privacidad y aviso legal») cumple como aviso legal, o hace falta una página separada con contenidos mínimos?

## 2. Aportaciones y fiscalidad
4. ¿Cómo deben declararse las aportaciones de particulares a una persona física que mantiene un proyecto sin ánimo de lucro? ¿Son donaciones (impuesto de donaciones del receptor) o rendimientos de actividad económica (IRPF, y en su caso alta censal / autónomos)? ¿Hay un umbral a partir del cual cambie?
5. ¿Conviene constituir una asociación sin ánimo de lucro para recibirlas? ¿Qué implicaría (coste, plazos, obligaciones)?
6. ¿Hay que informar en la web de algo más sobre las aportaciones (destino del dinero, ausencia de contraprestación, devoluciones)?
7. ¿Puede aceptarse una aportación de cualquier persona, incluida una persona jurídica o alguien vinculado a un partido, sin que eso plantee problemas de financiación electoral (LO 8/2007, LOREG)? ¿Conviene limitar importes o rechazar ciertas aportaciones?

## 3. Protección de datos (RGPD y LOPDGDD)
8. Con el funcionamiento descrito, ¿hay tratamiento de datos personales del que el titular sea responsable? (Respuestas solo en el navegador; GoatCounter; registros técnicos de GitHub; correos que lleguen al buzón de contacto).
9. Las respuestas a un test político pueden revelar opiniones políticas (categoría especial, art. 9 RGPD). Aunque no salen del navegador, ¿el enlace para compartir con respuestas exige alguna advertencia o base jurídica adicional? (Hoy se avisa de que quien lo abra podrá verlas).
10. ¿El texto de privacidad actual es suficiente (identidad del responsable, finalidad, base jurídica, derechos, transferencias a EE. UU. por GitHub y GoatCounter)? ¿Qué falta?
11. ¿Hace falta registro de actividades de tratamiento o algún contrato con GoatCounter o GitHub?

## 4. Normativa electoral (LOREG)
12. ¿Un test de afinidad con resultados individuales y la pregunta «¿Te ha resultado útil?» puede considerarse en algún caso encuesta o sondeo (art. 69 LOREG, prohibición de publicarlos en los cinco días previos)? El plan ya evita publicar o promocionar del 24 al 28 de noviembre: ¿es suficiente, o hay que desactivar algo más (por ejemplo, la página /metodologia/ con porcentajes de perfiles aleatorios)?
13. ¿Hay alguna restricción para la actividad de la web el día 28 (jornada de reflexión) y el 29, más allá de no promocionarla?
14. Las imágenes y textos para redes («pregunta del día» hasta el 23 de noviembre): ¿algún requisito específico para difundirlas en campaña?

## 5. Contenido y reclamaciones
15. ¿Qué riesgo hay si un partido considera inexacta la postura que se le atribuye? ¿Basta el procedimiento actual (fuentes enlazadas, enlace «¿Ves un error?» y registro público /correcciones/)?
16. La web usa nombres, siglas y colores de los partidos (sin logotipos) y 17 fotos de líderes de Wikimedia Commons con su licencia y atribución (`data/politicos.json`). ¿Es suficiente o hace falta algún permiso o aviso más (derecho a la propia imagen de cargos públicos)?

## Respuestas del asesor
_(Análisis orientativo del 7 nov 2026, hecho por Claude a petición del titular. **No es asesoramiento jurídico profesional ni sustituye a un abogado**: se basa en el conocimiento general de la normativa española y europea, sin consultar jurisprudencia ni criterios actuales de la AEPD, la Junta Electoral Central o Hacienda. Lo marcado «verificar» debe confirmarse antes de actuar.)_

### Resumen
| Tema | Riesgo | Qué hacer |
|---|---|---|
| Identificación del responsable (LSSI art. 10) | **Medio-alto** si se mantienen las donaciones | Decidir: o se publican nombre, NIF y domicilio/medio de contacto, o se retiran las aportaciones |
| Fiscalidad de las aportaciones | Medio | Consultar con gestor; declarar lo recibido |
| Texto de privacidad | Medio-bajo | Completarlo (responsable, base jurídica, derechos, transferencias, AEPD) |
| Correos de difusión (LSSI art. 21 y RGPD) | Medio | Revisar los 87 borradores: identificación + frase de baja; envío uno a uno |
| Normativa electoral (LOREG) | Bajo si se mantiene el plan | No publicar ni promocionar del 24 al 28; no difundir resultados agregados nunca |
| Posturas, fotos, nombres | Bajo | Mantener fuentes, canal de correcciones y atribución de las fotos |

### 1. LSSI
1. **¿Hay actividad económica?** La LSSI (Anexo a) incluye los servicios no remunerados por el destinatario «en la medida en que constituyan una actividad económica para el prestador». Una web gratuita sin publicidad ni venta probablemente quede fuera; pero **recibir aportaciones de forma habitual y promoverlas desde la web acerca el caso al supuesto «económico»**. Criterio prudente: tratarlo como incluido.
2. **Identificación.** Si está incluido, el art. 10.1 exige nombre o denominación social, domicilio, correo y otro medio de contacto directo, y NIF. **Un seudónimo no basta.** Incumplirlo es infracción leve (multa de hasta decenas de miles de euros; verificar importe actual). Se puede usar un domicilio distinto del personal si es un domicilio real de contacto (despacho, gestoría), no un simple apartado de correos (verificar). Dos salidas coherentes: (a) publicar los datos completos y seguir con aportaciones, o (b) retirar los botones de aportación y mantener solo el seudónimo y el correo, lo que acerca el proyecto a un servicio sin actividad económica. **Esta decisión es del titular; no se pueden inventar ni deducir los datos.**
3. **Aviso legal.** La sección «Privacidad y aviso legal» de /metodologia/ puede servir, pero conviene una página propia (/aviso-legal/) enlazada desde el pie, con identificación, objeto, propiedad intelectual (fotos con licencia y atribución), ley aplicable, canal de correcciones y exención de responsabilidad razonable.
4. **Almacenamiento en el navegador (LSSI art. 22.2).** Guardar respuestas en `localStorage` es un dispositivo de almacenamiento. Queda exento de consentimiento si es estrictamente necesario para un servicio solicitado por el usuario; guardar su progreso en el test lo es razonablemente. Mantener el texto que ya explica que se guarda solo en el navegador y cómo borrarlo.

### 2. Aportaciones y fiscalidad
4. Una persona física que recibe dinero de particulares sin contraprestación suele tratarse como **donación** (Impuesto sobre Sucesiones y Donaciones del receptor, según su comunidad autónoma). Si hay habitualidad, ordenación de medios y se orienta a un fin económico, Hacienda puede verlo como **actividad económica** (IRPF y alta censal). **No hay un umbral claro: consultar con un gestor** y conservar los justificantes de Stripe.
5. Una **asociación sin ánimo de lucro** ordenaría las aportaciones y la identificación, pero implica estatutos, registro, cuenta, obligaciones contables; solo compensa si el proyecto va a seguir y crecer.
6. En la web ya se dice que es gratuito, que no hay contraprestación y que no cambia el resultado. Añadir: destino general del dinero (cubrir costes) y que las aportaciones no son reembolsables salvo error, si se confirma con el gestor.
7. Una aportación de una persona jurídica o vinculada a un partido no se rige por la financiación de partidos (LO 8/2007), pero **sí daña la credibilidad**. Política recomendada: rechazar y devolver aportaciones de partidos, cargos y entidades vinculadas, y publicarlo en el texto de independencia (ya figura que no se acepta nada a cambio de modificar contenidos).

### 3. Protección de datos
8. Aunque las respuestas no salen del navegador, **sí hay tratamiento**: direcciones IP en los registros de GitHub Pages y en GoatCounter (la IP es dato personal aunque se anonimice después), y los correos que lleguen al buzón. Por tanto el titular es **responsable del tratamiento** de la analítica y del buzón.
9. El enlace de compartir lleva las respuestas en el fragmento `#`, que no se envía a ningún servidor. Revelar opiniones políticas es decisión de quien comparte; mantener la advertencia actual («quien lo abra podrá verlas») y no hacerla más visible no es necesario.
10. **El texto de privacidad actual es insuficiente en lo formal.** Falta: identidad del responsable (según el punto 1), finalidad de cada tratamiento, **base jurídica** (interés legítimo para la analítica sin cookies; consentimiento/atención de consulta para el correo), **derechos** (acceso, rectificación, supresión, oposición, limitación) y cómo ejercerlos por correo, **plazo de conservación**, **transferencias a EE. UU.** (GitHub, Inc.; comprobar su adhesión al Marco de Privacidad UE-EE. UU.), y el derecho a reclamar ante la **AEPD**. Hay un borrador al final de este documento.
11. Con tratamientos mínimos, el registro de actividades suele exigirse aunque sea sencillo en la práctica; una hoja con los tres tratamientos (analítica, buzón, difusión) es suficiente. Verificar con GoatCounter si ofrece acuerdo de encargado (muchos servicios lo publican como términos) y dónde aloja los datos.

### 4. Normativa electoral
12. El art. 69.7 LOREG prohíbe publicar sondeos electorales en los cinco días previos a la votación. Un test de afinidad **sin agregar ni publicar resultados de usuarios** no es un sondeo. Mantener siempre que el contador no registre respuestas ni resultados y no publicar nunca cifras de «qué vota la gente». La pregunta «¿Te ha resultado útil?» no es electoral. La página /metodologia/ usa perfiles simulados, no personas reales, y puede mantenerse con la aclaración de que no son encuestas. Plan prudente: **sin publicaciones nuevas, difusión ni cambios de contenido del 24 al 28 de noviembre.**
13. Jornada de reflexión (28) y votación (29): la prohibición de propaganda y captación de votos es para actos de campaña; una web neutral que ya existe no se ve afectada, pero **no se debe difundir ni promocionar esos días**. Verificar con la Junta Electoral Central si se quiere certeza.
14. Contenido de redes durante la campaña (13–27): no hay requisitos específicos para particulares si no hay recomendación de voto; mantener «no es una recomendación de voto» y no usar logotipos.

### 5. Contenido y reclamaciones
15. Atribuir posturas a partidos con fuente enlazada se ampara en la libertad de información (veracidad). Mantener: fuentes, marca de «estimada», enlace «¿Ves un error?», registro /correcciones/ y plazos de respuesta cortos. Si un partido reclama, responder por escrito, corregir lo erróneo y registrar la corrección.
16. Nombres y siglas: uso nominativo sin logotipos, correcto. Fotos: la licencia de Commons cubre el derecho de autor, **no** el derecho a la propia imagen; en cargos públicos fotografiados en actos públicos suele aplicar la excepción de la LO 1/1982 (art. 8.2.a). Mantener atribución y retirar de inmediato cualquier foto si su titular lo pide.

### 6. Correos de difusión (añadido)
- Enviar a medios, organizaciones y periodistas para dar a conocer una web gratuita puede considerarse **comunicación comercial** (LSSI art. 21: prohibido enviar comunicaciones comerciales por correo no solicitadas, salvo relación previa). La cobertura es dudosa, no clara. Riesgo moderado, atenuado por ser envíos personalizados uno a uno a direcciones profesionales publicadas.
- Condiciones mínimas: firmar con identificación (seudónimo y correo de contacto, o datos completos si se adopta la opción a del punto 1), **frase clara de baja** («si prefieres no recibir más correos, respóndeme y no te escribo»), explicar de dónde sale el contacto si se pregunta, no reenviar la lista, no enviar a particulares y respetar cualquier baja. La plantilla del plan ya incluye la frase de baja; **hay que comprobar que están en los 87 borradores antes del lunes.**

### Qué decide el titular (no puedo decidirlo yo)
1. Identificación completa **o** retirar las aportaciones.
2. Consultar con un gestor la fiscalidad de lo ya recibido.
3. Si quiere página /aviso-legal/ y el texto de privacidad ampliado (borrador abajo; no lo he publicado).
4. Contratar una consulta breve con un abogado para confirmar los puntos «verificar».

### Borrador del texto de privacidad ampliado (sin publicar)
**Responsable:** [datos según la decisión 1] · Contacto: test29n.es@gmail.com.
**Qué datos se tratan y para qué:** (1) Respuestas y provincia: solo en tu navegador, para darte el resultado; no los recibimos. (2) Medición de visitas con GoatCounter, sin cookies: recibe tu IP (no se guarda completa), la web de procedencia, el tamaño de pantalla y datos técnicos del navegador, para saber cuánta gente usa el test; base jurídica: interés legítimo (art. 6.1.f RGPD). (3) Correos que nos envíes: para responderte; base jurídica: tu consulta. (4) GitHub, Inc. aloja la web y puede registrar tu IP por seguridad.
**Conservación:** analítica y registros según los plazos del proveedor; correos, hasta atender la consulta y los plazos legales.
**Transferencias:** GitHub, Inc. (EE. UU.) [verificar marco de transferencia].
**Derechos:** acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo al correo de contacto; puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).
