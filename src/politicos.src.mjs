// Posturas individuales de políticos españoles (fuente editable; `node build.mjs` genera data/politicos.json).
//
// Criterio: solo se incluyen posturas que la persona ha defendido públicamente o que ha impulsado
// desde su cargo (propuestas, votaciones que ha liderado, decisiones de su gobierno, declaraciones).
// No se copia la postura del partido por defecto: si no hay pronunciamiento propio, no se incluye.
// pos: { códigoPregunta: [postura 1-5, "hecho en el que se basa"] }
// Cargos verificados a 17 de octubre de 2026.

export const POLITICIANS = [
 { id: "sanchez", name: "Pedro Sánchez", full: "Pedro Sánchez Pérez-Castejón", party: "psoe", partyLabel: "PSOE",
   role: "Presidente del Gobierno y candidato del PSOE al 29N",
   pos: {
     L01: [5, "En 2025 anunció una reforma constitucional para blindar el derecho al aborto."],
     L06: [4, "En 2025 propuso acabar con el anonimato en las redes sociales vinculando las cuentas a una identidad verificada."],
     H01: [1, "En la cumbre de la OTAN de 2025 rechazó comprometer el 3,5 % del PIB en defensa."],
     B07: [5, "En 2025 propuso un recargo de hasta el 100 % a compradores no residentes de fuera de la UE."],
     H04: [5, "Su Gobierno aprobó en 2025 el embargo de armas a Israel."],
     F04: [5, "Ha defendido que España necesita inmigración regular para sostener su economía."],
     D04: [4, "Defendió la Ley de Amnistía como medida para la convivencia en Cataluña."],
     G01: [2, "Defiende el calendario de cierre de las nucleares pactado en 2019."]
   } },
 { id: "feijoo", name: "Alberto Núñez Feijóo", full: "Alberto Núñez Feijóo", party: "pp", partyLabel: "PP",
   role: "Presidente del PP y candidato a la Presidencia del Gobierno",
   pos: {
     D09: [5, "Propone que gobierne la lista más votada."],
     D03: [5, "Defiende que los jueces elijan a la mayoría del CGPJ."],
     D04: [1, "Se opuso a la Ley de Amnistía."],
     C01: [1, "Rechaza la financiación singular pactada para Cataluña."],
     G01: [5, "Defiende alargar la vida de las centrales nucleares."],
     B03: [5, "Impulsó una ley antiokupación con desalojos en 24 horas."],
     F02: [2, "Ha rechazado la «remigración» que propone Vox; plantea expulsar sobre todo a quienes delinquen."],
     A03: [1, "Se opuso al impuesto estatal sobre las grandes fortunas."]
   } },
 { id: "abascal", name: "Santiago Abascal", full: "Santiago Abascal Conde", party: "vox", partyLabel: "Vox",
   role: "Presidente de Vox y candidato a la Presidencia del Gobierno",
   pos: {
     F03: [5, "Defiende la «prioridad nacional» en ayudas sociales y vivienda."],
     F02: [5, "Propone la «remigración» de los inmigrantes en situación irregular."],
     C03: [5, "Propone devolver al Estado competencias como la educación."],
     E08: [5, "Propone sustituir la Ley de Violencia de Género por una ley de violencia intrafamiliar."],
     G01: [5, "Defiende mantener abiertas las centrales nucleares."],
     L09: [5, "Su partido propuso en 2025 prohibir el burka y el niqab en espacios públicos, y él lo ha defendido."],
     K01: [1, "Se opone al acuerdo comercial UE-Mercosur."],
     I08: [5, "Defiende la tauromaquia como patrimonio y su apoyo público."]
   } },
 { id: "ayuso", name: "Isabel Díaz Ayuso", full: "Isabel Natividad Díaz Ayuso", party: "pp", partyLabel: "PP",
   role: "Presidenta de la Comunidad de Madrid",
   pos: {
     A03: [1, "Su Gobierno bonifica el impuesto de patrimonio y recurrió el impuesto estatal a las grandes fortunas."],
     A10: [5, "Madrid bonifica casi por completo las herencias entre padres e hijos."],
     B01: [1, "Se ha negado a aplicar en Madrid los topes al alquiler de la Ley de Vivienda."],
     I03: [4, "Se opuso al decreto de 2025 que endurece los requisitos de las universidades privadas."],
     I01: [5, "Defiende la libertad de elección de centro y la escuela concertada."],
     C01: [1, "Rechaza la financiación singular de Cataluña."],
     J01: [1, "Su Gobierno mantiene hospitales públicos de gestión privada y conciertos sanitarios."]
   } },
 { id: "page", name: "Emiliano García-Page", full: "Emiliano García-Page Sánchez", party: "psoe", partyLabel: "PSOE",
   role: "Presidente de Castilla-La Mancha",
   pos: {
     C01: [1, "Se ha opuesto públicamente a la financiación singular de Cataluña, a diferencia de la dirección de su partido."],
     D04: [1, "Se opuso a la Ley de Amnistía, también a diferencia de su partido."],
     G04: [1, "Se opone a ampliar el trasvase Tajo-Segura."],
     C05: [1, "Rechaza cualquier referéndum de autodeterminación."]
   } },
 { id: "illa", name: "Salvador Illa", full: "Salvador Illa i Roca", party: "psoe", partyLabel: "PSC-PSOE",
   role: "Presidente de la Generalitat de Cataluña",
   pos: {
     C01: [4, "Pactó con ERC en 2024 una financiación singular en la que Cataluña recaudaría progresivamente sus impuestos, aunque rechaza llamarlo concierto."],
     D04: [4, "Apoyó la Ley de Amnistía."],
     C05: [1, "Rechaza un referéndum de independencia."],
     B01: [5, "Su Gobierno aplica los topes al alquiler en las zonas tensionadas de Cataluña."]
   } },
 { id: "colau", name: "Ada Colau", full: "Ada Colau Ballano", party: "fa", partyLabel: "Comuns · Frente Amplio",
   role: "Candidata del Frente Amplio y exalcaldesa de Barcelona",
   pos: {
     B01: [5, "Defendió la regulación de los alquileres como alcaldesa de Barcelona."],
     B05: [5, "Como alcaldesa frenó las nuevas licencias de pisos turísticos."],
     B06: [5, "Como alcaldesa sancionó a grandes propietarios por mantener pisos vacíos."],
     H04: [5, "En 2023 suspendió como alcaldesa las relaciones de Barcelona con el Gobierno israelí y en 2025 viajó en la flotilla hacia Gaza."],
     D04: [5, "Apoyó la Ley de Amnistía."]
   } },
 { id: "montero", name: "Irene Montero", full: "Irene María Montero Gil", party: "pod", partyLabel: "Podemos",
   role: "Eurodiputada y candidata de Podemos al 29N",
   pos: {
     L03: [5, "Como ministra de Igualdad impulsó la «ley trans» de 2023."],
     F01: [5, "Defiende la regularización extraordinaria de inmigrantes."],
     H04: [5, "Pide romper relaciones con Israel."],
     H01: [1, "Rechaza el aumento del gasto militar."],
     E03: [5, "Pide derogar la «ley mordaza»."],
     B01: [5, "Propone bajar por ley los alquileres."]
   } },
 { id: "rufian", name: "Gabriel Rufián", full: "Gabriel Rufián Romero", party: "erc", partyLabel: "ERC",
   role: "Portavoz de ERC en el Congreso y candidato por Barcelona",
   pos: {
     C01: [5, "Defiende que Cataluña recaude y gestione todos sus impuestos."],
     C05: [5, "Defiende un referéndum de autodeterminación pactado."],
     D04: [5, "Votó y defendió la Ley de Amnistía."],
     H04: [5, "Ha pedido el embargo de armas a Israel."],
     E03: [5, "Ha defendido derogar la «ley mordaza»."],
     D07: [5, "Defiende que España sea una república."]
   } },
 { id: "nogueras", name: "Míriam Nogueras", full: "Míriam Nogueras i Camero", party: "junts", partyLabel: "Junts",
   role: "Portavoz de Junts en el Congreso y candidata por Barcelona",
   pos: {
     A01: [1, "Anunció en 2025 el voto de Junts contra la reducción por ley de la jornada a 37,5 horas."],
     E01: [5, "Ha impulsado endurecer las penas contra la multirreincidencia."],
     C01: [5, "Reclama que Cataluña recaude todos sus impuestos."],
     C05: [5, "Defiende la independencia y el derecho a decidir de Cataluña."],
     I09: [5, "Defiende el catalán como requisito y lengua propia de la administración catalana."],
     D04: [5, "Negoció la Ley de Amnistía."]
   } },
 { id: "alvise", name: "Alvise Pérez", full: "Luis «Alvise» Pérez Fernández", party: "salf", partyLabel: "SALF",
   role: "Eurodiputado y líder de Se Acabó La Fiesta",
   pos: {
     E01: [5, "Propone penas mucho más duras para los multirreincidentes y más plazas de prisión."],
     F02: [5, "Defiende expulsar a los inmigrantes en situación irregular."],
     A02: [1, "Propone una fuerte bajada de impuestos y recortar organismos públicos."]
   } },
 { id: "esteban", name: "Aitor Esteban", full: "Aitor Esteban Bravo", party: "pnv", partyLabel: "EAJ-PNV",
   role: "Presidente del Euzkadi Buru Batzar del PNV",
   pos: {
     C09: [1, "Defiende el Concierto Económico vasco tal como está."],
     H02: [5, "Ha defendido una mayor integración europea."],
     D04: [4, "Como portavoz del PNV en el Congreso apoyó la Ley de Amnistía."]
   } },
 { id: "ponton", name: "Ana Pontón", full: "Ana Belén Pontón Mondelo", party: "bng", partyLabel: "BNG",
   role: "Portavoz nacional del BNG",
   pos: {
     C05: [5, "Defiende el derecho de autodeterminación de Galicia."],
     G05: [4, "Reclama una tarifa eléctrica gallega y más control público de la energía."],
     B01: [5, "Pide topes al precio del alquiler."]
   } },
 { id: "clavijo", name: "Fernando Clavijo", full: "Fernando Clavijo Batlle", party: "ccpc", partyLabel: "CC",
   role: "Presidente de Canarias",
   pos: {
     F05: [5, "Ha reclamado el reparto obligatorio de los menores migrantes entre comunidades."],
     B05: [4, "Su Gobierno impulsó la ley canaria de vivienda vacacional, aprobada en 2025, que limita su expansión."],
     A10: [5, "Su Gobierno bonificó en 2023 el impuesto de sucesiones entre familiares directos."]
   } },
 { id: "monica", name: "Mónica García", full: "Mónica García Gómez", party: "fa", partyLabel: "Más Madrid · Frente Amplio",
   role: "Ministra de Sanidad",
   pos: {
     J01: [5, "Su ministerio remitió a las Cortes en 2026 un proyecto de ley para limitar la gestión privada de la sanidad pública."],
     J03: [4, "Su Estatuto Marco propone exigir dedicación exclusiva a los nuevos jefes de servicio."],
     J04: [4, "Ha propuesto subir los impuestos del tabaco y extenderlos a los vapeadores."]
   } },
 { id: "urtasun", name: "Ernest Urtasun", full: "Ernest Urtasun Domènech", party: "fa", partyLabel: "Comuns · Frente Amplio",
   role: "Ministro de Cultura",
   pos: {
     I08: [1, "Suprimió en 2024 el Premio Nacional de Tauromaquia."],
     H04: [5, "Ha defendido el embargo de armas a Israel."],
     A01: [5, "Defendió como portavoz de Sumar la jornada de 37,5 horas."]
   } }
];
