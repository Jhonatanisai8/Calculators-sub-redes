# Calculadora de Subredes IP

Aplicación web para calcular información de red a partir de una dirección IP y la cantidad de hosts o máscara de subred.

## Características

- ✅ Validación de direcciones IPv4
- ✅ Cálculo basado en cantidad de hosts o máscara de subred
- ✅ Interfaz responsiva y amigable
- ✅ Manejo de errores con mensajes claros
- ✅ Resultados detallados de la subred

## Funcionalidades

La aplicación calcula y muestra:

- **IP de Red**: Dirección de red de la subred
- **Máscara de Subred**: Máscara utilizada para la subred
- **IP de Broadcast**: Dirección de broadcast de la subred
- **Primer Host**: Primera dirección IP válida para hosts
- **Último Host**: Última dirección IP válida para hosts
- **Gateway**: Gateway predeterminado (primer host)
- **Total de Hosts**: Cantidad total de hosts disponibles

## Cómo usar

1. **Ingresa una dirección IP válida** (ejemplo: 192.168.1.100)
2. **Selecciona el tipo de entrada**:
   - **Cantidad de hosts**: Especifica cuántos hosts necesitas
   - **Máscara de subred**: Ingresa directamente la máscara (ejemplo: 255.255.255.0)
3. **Haz clic en "Calcular"**
4. **Revisa los resultados** que aparecerán en la sección inferior

## Ejemplos de uso

### Ejemplo 1: Usando cantidad de hosts
- **IP**: 192.168.1.100
- **Hosts**: 50
- **Resultado**: Máscara /26 (255.255.255.192) con 62 hosts disponibles

### Ejemplo 2: Usando máscara de subred
- **IP**: 10.0.0.50
- **Máscara**: 255.255.255.0
- **Resultado**: Red 10.0.0.0/24 con 254 hosts disponibles

## Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo con gradientes y animaciones
- **JavaScript ES6+**: Lógica de cálculo y validación

## Estructura del proyecto

```
demo-calculator-ip/
├── index.html          # Estructura principal
├── styles.css          # Estilos y diseño responsivo
├── script.js           # Lógica de la aplicación
├── requimientos.txt    # Especificaciones del proyecto
└── README.md          # Documentación
```

## Características técnicas

### Validaciones implementadas
- Formato IPv4 válido (0-255 por octeto)
- Máscara de subred válida (bits contiguos)
- Rango de hosts válido (1 a 16,777,214)

### Cálculos soportados
- Conversión IP ↔ Número
- Operaciones bitwise para red y broadcast
- Cálculo automático de máscara desde hosts
- Determinación de rango de hosts disponibles

## Compatibilidad

- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)
- ✅ Dispositivos móviles y tablets
- ✅ Diseño responsivo para diferentes tamaños de pantalla

## Instalación y ejecución

1. Clona o descarga los archivos del proyecto
2. Abre `index.html` en tu navegador web
3. ¡Listo para usar!

### Servidor local (opcional)

Para una mejor experiencia, puedes servir los archivos desde un servidor local:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve .

# Con PHP
php -S localhost:8000
```

Luego visita `http://localhost:8000` en tu navegador.

## Autor

Desarrollado como proyecto educativo para aprender JavaScript y cálculos de redes.

---

**Nota**: Esta aplicación es solo para fines educativos y de aprendizaje. Para uso en producción, considera validaciones adicionales y pruebas exhaustivas.