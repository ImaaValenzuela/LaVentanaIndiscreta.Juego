export interface Scene {
  id: string;
  filename: string;
  originalNumber: number; // 1 to 31 representing chronological sequence
  title: string;
  description: string;
}

export const allScenes: Scene[] = [
  {
    id: "scene-1",
    filename: "escena1.png",
    originalNumber: 1,
    title: "El departamento de Jefferies",
    description: "Jefferies, un fotógrafo de aventuras confinado a una silla de ruedas por una pierna enyesada, observa el patio interior de su edificio en Greenwich Village en un caluroso día de verano."
  },
  {
    id: "scene-2",
    filename: "escena2.png",
    originalNumber: 2,
    title: "Los vecinos del patio",
    description: "A través de su ventana, Jefferies espía las vidas cotidianas de sus vecinos: la bailarina sensual 'Miss Torso', un compositor con bloqueos artísticos y el matrimonio Thorwald."
  },
  {
    id: "scene-3",
    filename: "escena3.png",
    originalNumber: 3,
    title: "Las advertencias de Stella",
    description: "Stella, la enfermera de la aseguradora, visita a Jefferies para masajearlo. Le advierte sobre el peligro de convertirse en un 'voyeur' y le aconseja casarse con Lisa."
  },
  {
    id: "scene-4",
    filename: "escena4.png",
    originalNumber: 4,
    title: "La aparición de Lisa",
    description: "Lisa Freemont, la glamorosa novia de Jefferies, llega en el crepúsculo. Ella irrumpe con estilo, encendiendo las luces y dándole un beso dramático de película."
  },
  {
    id: "scene-5",
    filename: "escena5.png",
    originalNumber: 5,
    title: "Una cena tensa",
    description: "Lisa y Jefferies cenan langosta y discuten su futuro. Jefferies insiste en que ella no soportaría su vida nómada y dura, mientras que Lisa quiere que él se establezca en Nueva York."
  },
  {
    id: "scene-6",
    filename: "escena6.png",
    originalNumber: 6,
    title: "La noche acecha",
    description: "Jefferies se queda solo en la oscuridad de su apartamento. Mientras la noche avanza y se desata una tormenta de lluvia, él continúa vigilando el patio con creciente obsesión."
  },
  {
    id: "scene-7",
    filename: "escena7.png",
    originalNumber: 7,
    title: "La disputa matrimonial",
    description: "A través del teleobjetivo, Jefferies observa a Lars Thorwald discutiendo acaloradamente con su esposa, una mujer enferma y postrada en cama que parece infeliz."
  },
  {
    id: "scene-8",
    filename: "escena8.png",
    originalNumber: 8,
    title: "Thorwald baja la persiana",
    description: "Lars Thorwald cierra las persianas de su apartamento en mitad de la noche, cortando la visibilidad de Jefferies y aumentando el misterio."
  },
  {
    id: "scene-9",
    filename: "escena9.png",
    originalNumber: 9,
    title: "Sospechas nocturnas",
    description: "En la madrugada lluviosa, Jefferies ve a Thorwald salir y entrar del edificio en tres ocasiones portando su maletín de vendedor, un comportamiento inusual a esas horas."
  },
  {
    id: "scene-10",
    filename: "escena10.png",
    originalNumber: 10,
    title: "El cuchillo y la sierra",
    description: "Por la mañana, Jefferies nota que la cama de la Sra. Thorwald está vacía. Luego observa a Lars Thorwald limpiando meticulosamente un cuchillo de carnicero y una sierra en su cocina."
  },
  {
    id: "scene-11",
    filename: "escena11.png",
    originalNumber: 11,
    title: "Lisa se une a la sospecha",
    description: "Tras escuchar las teorías de Jefferies, Lisa inicialmente se muestra escéptica. Sin embargo, al observar que Thorwald ata un baúl grande con cuerdas, ella comienza a convencerse."
  },
  {
    id: "scene-12",
    filename: "escena12.png",
    originalNumber: 12,
    title: "El escepticismo de Doyle",
    description: "Thomas Doyle, detective de la policía y amigo de guerra de Jefferies, llega para escuchar sus sospechas. Doyle se muestra cínico y rechaza la idea del asesinato por falta de pruebas."
  },
  {
    id: "scene-13",
    filename: "escena13.png",
    originalNumber: 13,
    title: "El baúl misterioso",
    description: "Jefferies y Lisa vigilan a Thorwald mientras dos transportistas retiran el gran baúl atado de su apartamento. Jefferies sospecha que allí dentro oculta los restos de su esposa."
  },
  {
    id: "scene-14",
    filename: "escena14.png",
    originalNumber: 14,
    title: "El perro curioso",
    description: "Jefferies observa que el perro de una vecina del piso superior husmea y escarba obsesivamente en una parte específica del parterre de flores del jardín de Thorwald."
  },
  {
    id: "scene-15",
    filename: "escena15.png",
    originalNumber: 15,
    title: "Las explicaciones de Doyle",
    description: "Doyle regresa con noticias: la Sra. Thorwald fue vista subiendo a un tren y el baúl solo contenía ropa. Doyle insta a Jefferies a dejar de espiar a los vecinos."
  },
  {
    id: "scene-16",
    filename: "escena16.png",
    originalNumber: 16,
    title: "La soledad y la música",
    description: "Jefferies observa a 'Miss Lonelyhearts' cenando con una cita imaginaria, mientras el compositor toca una hermosa melodía en su piano que alivia la melancolía del patio."
  },
  {
    id: "scene-17",
    filename: "escena17.png",
    originalNumber: 17,
    title: "Crimen en el jardín",
    description: "La dueña del perro grita horrorizada desde su balcón al descubrir al animal muerto en el patio con el cuello roto. Todos los vecinos se asoman consternados a sus ventanas."
  },
  {
    id: "scene-18",
    filename: "escena18.png",
    originalNumber: 18,
    title: "El sospechoso silencioso",
    description: "Mientras todo el vecindario reacciona con tristeza e indignación por la muerte del perro, Jefferies nota que Lars Thorwald permanece sentado en la oscuridad fumando un cigarrillo."
  },
  {
    id: "scene-19",
    filename: "escena19.png",
    originalNumber: 19,
    title: "El plan de investigación",
    description: "Convencidos de que el perro fue asesinado por excavar en las flores de Thorwald, Jefferies, Lisa y Stella conspiran para registrar ese rincón del jardín por la noche."
  },
  {
    id: "scene-20",
    filename: "escena20.png",
    originalNumber: 20,
    title: "La carta chantaje",
    description: "Jefferies escribe una nota anónima: '¿Qué ha hecho con ella?'. Lisa desliza la carta por debajo de la puerta de Thorwald mientras Jefferies observa su reacción aterrorizada."
  },
  {
    id: "scene-21",
    filename: "escena21.png",
    originalNumber: 21,
    title: "La llamada trampa",
    description: "Jefferies llama al teléfono de Thorwald, haciéndose pasar por un chantajista. Lo cita en un hotel para conseguir que salga, permitiendo que Lisa y Stella investiguen el jardín."
  },
  {
    id: "scene-22",
    filename: "escena22.png",
    originalNumber: 22,
    title: "Excavación nocturna",
    description: "Lisa y Stella desentierran la sección señalada del jardín, pero no encuentran nada. Thorwald ha retirado lo que sea que estuviera allí antes de que el perro lo delatara."
  },
  {
    id: "scene-23",
    filename: "escena23.png",
    originalNumber: 23,
    title: "Lisa sube la apuesta",
    description: "En un acto de audacia temeraria, Lisa trepa por la escalera de incendios e ingresa al apartamento de Thorwald a través de la ventana abierta para buscar pruebas directas."
  },
  {
    id: "scene-24",
    filename: "escena24.png",
    originalNumber: 24,
    title: "El intruso regresa",
    description: "Thorwald regresa inesperadamente. Jefferies observa aterrorizado por su teleobjetivo cómo Thorwald descubre a Lisa, la sujeta y comienza a forcejear con ella en la penumbra."
  },
  {
    id: "scene-25",
    filename: "escena25.png",
    originalNumber: 25,
    title: "La llamada a la policía",
    description: "La policía irrumpe tras la llamada de emergencia de Jefferies y arresta a Lisa. Ella, a espaldas de los oficiales, le hace una señal a Jefferies señalando su dedo con el anillo de bodas."
  },
  {
    id: "scene-26",
    filename: "escena26.png",
    originalNumber: 26,
    title: "Contacto visual mortal",
    description: "Thorwald nota la señal de Lisa, mira hacia el patio y descubre a Jefferies observándolo desde su ventana oscura. El asesino y el voyeur se miran fijamente a los ojos."
  },
  {
    id: "scene-27",
    filename: "escena27.png",
    originalNumber: 27,
    title: "Vulnerabilidad total",
    description: "Stella sale para pagar la fianza de Lisa. Jefferies llama a Doyle para explicar lo del anillo, pero se queda completamente solo e indefenso en su silla de ruedas en la oscuridad."
  },
  {
    id: "scene-28",
    filename: "escena28.png",
    originalNumber: 28,
    title: "El asesino en casa",
    description: "Jefferies escucha pasos pesados acercándose por el pasillo. La puerta de su apartamento se abre lentamente en la penumbra, revelando la silueta de Lars Thorwald acechante."
  },
  {
    id: "scene-29",
    filename: "escena29.png",
    originalNumber: 29,
    title: "Defensa con destellos",
    description: "Mientras Thorwald avanza para atacarlo, Jefferies dispara repetidamente las bombillas de flash de su cámara, cegando temporalmente al asesino con ráfagas de luz naranja."
  },
  {
    id: "scene-30",
    filename: "escena30.png",
    originalNumber: 30,
    title: "La caída",
    description: "Thorwald lucha con Jefferies y lo empuja fuera de la ventana. Jefferies queda colgado en el aire gritando por ayuda justo antes de caer sobre el asfalto amortiguado por oficiales."
  },
  {
    id: "scene-31",
    filename: "escena31.png",
    originalNumber: 31,
    title: "Dos yesos y paz",
    description: "Semanas después, Jefferies descansa en su apartamento con ambas piernas enyesadas. Lisa, vestida casual, lee un libro de viajes y le sonríe satisfecha por haber resuelto el misterio."
  }
];
