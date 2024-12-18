import xml.etree.ElementTree as ET

def convert_xml_to_kml(xml_file, kml_file):
    # Leer el archivo XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Espacio de nombres del archivo XML
    ns = {'ns': 'http://www.uniovi.es'}

    # Crear el archivo KML
    with open(kml_file, 'w') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
        f.write('  <Document>\n')

        # Extraer el nombre del circuito
        nombre_circuito = root.find('ns:nombre', ns).text
        f.write(f'    <name>{nombre_circuito}</name>\n')

        f.write('    <Placemark>\n')
        f.write('      <name>Ruta del Circuito</name>\n')
        f.write('      <LineString>\n')
        f.write('        <coordinates>\n')

        # Extraer coordenadas iniciales del circuito
        initial_lon = root.find('ns:coordenadas/ns:longitud', ns).text
        initial_lat = root.find('ns:coordenadas/ns:latitud', ns).text
        initial_alt = root.find('ns:coordenadas/ns:altitud', ns).text
        f.write(f'          {initial_lon},{initial_lat},{initial_alt}\n')

        # Extraer y recorrer los tramos del circuito
        for tramo in root.findall('ns:tramos/ns:tramo', ns):
            lon = tramo.find('ns:longitudInicial', ns).text
            lat = tramo.find('ns:latitudInicial', ns).text
            alt = tramo.find('ns:altitudInicial', ns).text
            f.write(f'          {lon},{lat},{alt}\n')

        f.write('        </coordinates>\n')
        f.write('      </LineString>\n')
        f.write('    </Placemark>\n')
        f.write('  </Document>\n')
        f.write('</kml>\n')

# Uso de la función
convert_xml_to_kml('circuitoEsquema.xml', 'circuito.kml')
