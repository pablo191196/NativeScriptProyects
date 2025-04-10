interface PageLoadedEventData {
  object: any;
  eventName: string;
}
let animationTimerId: ReturnType<typeof setTimeout> | null = null;

export class GradientAnimation {
  // Función para limpiar la animación cuando la página se descarga
  static onPageUnloaded() {
    if (animationTimerId !== null) {
      clearTimeout(animationTimerId);
      animationTimerId = null;
      console.log("Animacion detenida");
    }
  }

  // Animación del fondo con gradiente cíclico usando generación dinámica de colores
  static onPageLoaded(args: PageLoadedEventData) {
    // Si ya hay una animación en curso, no iniciar otra
    if (animationTimerId !== null) {
      console.log("Animation already running, not starting another");
      return;
    }
    const page = args.object;
    const gradientBg = page.getViewById("gradientBackground");

    if (gradientBg) {
      // Valor inicial del tono (hue) en el espacio de color HSL
      let baseHue = 0;

      // Función para convertir HSL a Hex
      function hslToHex(h: number, s: number, l: number): string {
        // tono esté entre 0 y 360
        h = h % 360;
        if (h < 0) h += 360;

        // Convertimos HSL a RGB
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
        const m = l - c / 2;

        let r, g, b;

        if (h >= 0 && h < 60) {
          [r, g, b] = [c, x, 0];
        } else if (h >= 60 && h < 120) {
          [r, g, b] = [x, c, 0];
        } else if (h >= 120 && h < 180) {
          [r, g, b] = [0, c, x];
        } else if (h >= 180 && h < 240) {
          [r, g, b] = [0, x, c];
        } else if (h >= 240 && h < 300) {
          [r, g, b] = [x, 0, c];
        } else {
          [r, g, b] = [c, 0, x];
        }

        // Convertimos RGB a Hex
        const toHex = (value: number) => {
          const hex = Math.round((value + m) * 255).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      }

      // Función para generar los colores del gradiente basados en el tono base
      function generateGradientColors(baseHue: number) {
        // Generamos tres colores con diferencia de tono para crear un gradiente suave
        // Usamos alta saturación (80%) y luminosidad media (60%) para colores vibrantes
        const startColor = hslToHex(baseHue, 80, 70);
        const middleColor = hslToHex((baseHue + 40) % 360, 80, 60);
        const endColor = hslToHex((baseHue + 80) % 360, 80, 50);

        return { start: startColor, middle: middleColor, end: endColor };
      }


      function updateGradient() {
        try {
          // Generamos los colores dinámicamente
          const currentColors = generateGradientColors(baseHue);

          // Actualizamos el gradiente
          gradientBg.style.backgroundImage = `linear-gradient(270deg, ${currentColors.start}, ${currentColors.middle}, ${currentColors.end})`;

          // Incrementamos el tono base para la próxima actualización
          // Un incremento de 15 grados por paso crea una transición suave
          baseHue = (baseHue + 15) % 360;
          // Programa la siguiente actualización y guarda el ID
          animationTimerId = setTimeout(updateGradient, 75);

        } catch (error) {
          console.error("Error en la animación del gradiente:", error);
        }
      }

      updateGradient();

      // Detenemos la animación luego de 5 segundos
      setTimeout(() => {
        if (animationTimerId !== null) {
          clearTimeout(animationTimerId);
          animationTimerId = null;
          console.log("Animacion detenida");
        }
      }, 10000); // 5000 milisegundos = 5 segundos

      // Añade una clase para activar la animación CSS
      gradientBg.className = gradientBg.className + " animate-gradient";
    }
  }
}
