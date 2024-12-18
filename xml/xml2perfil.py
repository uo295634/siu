import xml.etree.ElementTree as ET

def convert_xml_to_svg(xml_file, svg_file):
    # Parsear el archivo XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Espacio de nombres del archivo XML
    ns = {'ns': 'http://www.uniovi.es'}

    # Obtener los tramos del circuito
    tramos = root.findall('ns:tramos/ns:tramo', ns)

    # Inicializar variables para SVG
    width = 800  # Ancho de la imagen SVG
    height = 400  # Altura de la imagen SVG
    margin = 50  # Margen para dar espacio alrededor del gráfico
    max_altitud = 0  # Para calcular la altitud máxima
    total_distancia = 0  # Para calcular la distancia total del circuito

    # Lista de coordenadas para la polilínea
    points = []

    # Recorrer los tramos y extraer distancias y altitudes
    for tramo in tramos:
        distancia = float(tramo.find('ns:distancia', ns).text)
        altitud = float(tramo.find('ns:altitudInicial', ns).text)

        total_distancia += distancia  # Acumular la distancia
        if altitud > max_altitud:
            max_altitud = altitud  # Encontrar la altitud máxima

        # Agregar las coordenadas a la lista de puntos (con escalado)
        x = total_distancia  # La distancia es nuestro eje X
        y = height - (altitud / max_altitud) * (height - 2 * margin)  # Escalar la altitud para ajustarla en el SVG
        points.append((x, y))

    # Crear el archivo SVG
    with open(svg_file, 'w') as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">\n')
        f.write('  <rect width="100%" height="100%" fill="white"/>\n')  # Fondo blanco

        # Dibujar la polilínea con los puntos obtenidos
        f.write('  <polyline points="')
        f.write(' '.join([f'{x},{y}' for x, y in points]))
        f.write('" style="fill:none;stroke:black;stroke-width:2"/>\n')

        # Cerrar la polilínea para hacer el efecto de suelo
        f.write('  <polyline points="')
        f.write(' '.join([f'{x},{y}' for x, y in points]))
        f.write(f' {width},{height} 0,{height}" style="fill:lightgray;stroke:none"/>\n')

        f.write('</svg>\n')

# Uso de la función
convert_xml_to_svg('circuitoEsquema.xml', 'altimetria.svg')
