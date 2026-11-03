<?php

/**
 * Utiles Generales Datos maestros
 * @copyright  XETID
 * @package    Configuración
 * @subpackage Común/Models/Bussines
 * @version    1.0
 * @author    Ing. Lisvany Alonso Martinez
 */
class UtilesDatosMaestros
{

    /**
     * Colorea en amarrillo las coincidencias con la cadena "filter"
     * encontradas en en el arreglo "data" en la columna "value"
     *
     * @param array $data Arreglo de datos
     * @param string|array $value Columna(s) a chequear
     * @param string|array $filter Valor(es) de chequeo
     * @param bool $subArray Para chequear los arreglos con subestructuras
     *
     * @return array Arreglo inicial con las coincidencias coloreadas en amarrillo
     */
    public static function colorSearch($data = array(), $value = '', $filter = '', $subArray = false)
    {
        if ($subArray) {
            foreach ($data as &$campo) {
                foreach ($campo as &$cam) {
                    if (is_array($value)) {
                        foreach ($value as $i => $v) {
                            if ($cam[$v]) {
                                $cam[$v] = self::colorWord($cam[$v], $filter[$i]);
                            }
                        }
                    } else {
                        if ($cam[$value]) {
                            $cam[$value] = self::colorWord($cam[$value], $filter);
                        }
                    }
                }
            }
        } else {
            foreach ($data as &$campo) {
                if (is_array($value)) {
                    foreach ($value as $i => $v) {
                        if ($campo[$v]) {
                            $campo[$v] = self::colorWord($campo[$v], $filter[$i]);
                        }
                    }
                } else {
                    if ($campo[$value]) {
                        $campo[$value] = self::colorWord($campo[$value], $filter);
                    }
                }
            }
        }
        return $data;
    }

    /**
     * Colorea una palabra en amarillo devolviendo exactamente la palabra sin hacer reemplazos
     * entre mayúsculas o minúsculas, esto pasaba al utilizar la función "str_ireplace"
     *
     * @param string $word Palabra a colorear
     * @param string $filter Palabra de coincidencia
     *
     * @return string Palabra coloreada
     */
    public static function colorWord($word = '', $filter = '')
    {
        if ($word) {
            $word = str_replace(
                array('\u00e1', '\u00e9', '\u00ed', '\u00f3', '\u00fa'),
                array('á', 'é', 'í', 'ó', 'ú'),
                $word
            );//print_r($word . ' *- ');
            $contFilter = strlen($filter);
            $cont = strlen($word);
            $tmpCampo = '';
            $exc = 0;
            $filterCondition = self::characterConditionToRepace($filter);
            $wordCondition = self::characterConditionToRepace($word);
            for ($i = 0; $i < $cont; $i++) {
                if (strtolower($wordCondition[$i]) == strtolower($filterCondition[0])) {
                    $tmp = '';
                    for ($f = 0; $f < $contFilter; $f++) {
                        if (($cont > ($i + $f))
                            && (strtolower($wordCondition[$i + $f]) == strtolower($filterCondition[$f]))
                        ) {
                            $tmp .= $word[$i + $f];
                        }
                    }
                    $tmpCondition = self::characterConditionToRepace($tmp);
                    if (strtolower($tmpCondition) == strtolower($filterCondition)) {
                        $tmpCampo .= "<span style=\"background-color: rgb(255, 255, 0);\">" . $tmp . "</span>";
                        $exc = $contFilter;
                    }
                }
                if ($exc == 0) {
                    $tmpCampo .= $word[$i];
                } else {
                    $exc--;
                }
            }
            return $tmpCampo;
        } else {
            return '';
        }
    }

    private static function characterConditionToRepace($word)
    {
        $word = strtolower($word);
        $cont = strlen($word);
        $tmpWord = '';
        for ($k = 0; $k < $cont; $k++) {
            switch ($word[$k]) {
                case 'a' : $tmpWord .= 'a'; break;
                case 'á' : $tmpWord .= 'a'; break;
                case 'à' : $tmpWord .= 'a'; break;
                case 'ä' : $tmpWord .= 'a'; break;
                case 'â' : $tmpWord .= 'a'; break;
                case 'ª' : $tmpWord .= 'a'; break;
                case 'e' : $tmpWord .= 'e'; break;
                case 'é' : $tmpWord .= 'e'; break;
                case 'è' : $tmpWord .= 'e'; break;
                case 'ë' : $tmpWord .= 'e'; break;
                case 'ê' : $tmpWord .= 'e'; break;
                case 'i' : $tmpWord .= 'i'; break;
                case 'í' : $tmpWord .= 'i'; break;
                case 'ì' : $tmpWord .= 'i'; break;
                case 'ï' : $tmpWord .= 'i'; break;
                case 'î' : $tmpWord .= 'i'; break;
                case 'o' : $tmpWord .= 'o'; break;
                case 'ó' : $tmpWord .= 'o'; break;
                case 'ò' : $tmpWord .= 'o'; break;
                case 'ö' : $tmpWord .= 'o'; break;
                case 'ô' : $tmpWord .= 'o'; break;
                case 'u' : $tmpWord .= 'u'; break;
                case 'ú' : $tmpWord .= 'u'; break;
                case 'ù' : $tmpWord .= 'u'; break;
                case 'ü' : $tmpWord .= 'u'; break;
                case 'û' : $tmpWord .= 'u'; break;
                default : $tmpWord .= $word[$k];
            }
        }
        return $tmpWord;
    }

    public static function accentWordToSearch($value, $word = '')
    {
        $word = str_replace(
            array('\u00e1', '\u00e9', '\u00ed', '\u00f3', '\u00fa'),
            array('á', 'é', 'í', 'ó', 'ú'),
            $word
        );
        $a = "[aáàäâª]";
        $e = "[eéèëê]";
        $i = "[iíìïî]";
        $o = "[oóòöô]";
        $u = "[uúùüû]";
        $word = strtolower($word);
        $cont = strlen($word);
        $tmpWord = '';
        for ($k = 0; $k < $cont; $k++) {
            switch ($word[$k]) {
                case 'a' : $tmpWord .= $a; break;
                case 'á' : $tmpWord .= $a; break;
                case 'à' : $tmpWord .= $a; break;
                case 'ä' : $tmpWord .= $a; break;
                case 'â' : $tmpWord .= $a; break;
                case 'ª' : $tmpWord .= $a; break;
                case 'e' : $tmpWord .= $e; break;
                case 'é' : $tmpWord .= $e; break;
                case 'è' : $tmpWord .= $e; break;
                case 'ë' : $tmpWord .= $e; break;
                case 'ê' : $tmpWord .= $e; break;
                case 'i' : $tmpWord .= $i; break;
                case 'í' : $tmpWord .= $i; break;
                case 'ì' : $tmpWord .= $i; break;
                case 'ï' : $tmpWord .= $i; break;
                case 'î' : $tmpWord .= $i; break;
                case 'o' : $tmpWord .= $o; break;
                case 'ó' : $tmpWord .= $o; break;
                case 'ò' : $tmpWord .= $o; break;
                case 'ö' : $tmpWord .= $o; break;
                case 'ô' : $tmpWord .= $o; break;
                case 'u' : $tmpWord .= $u; break;
                case 'ú' : $tmpWord .= $u; break;
                case 'ù' : $tmpWord .= $u; break;
                case 'ü' : $tmpWord .= $u; break;
                case 'û' : $tmpWord .= $u; break;
                default : $tmpWord .= $word[$k];
            }
        }
        return " lower($value) ~ '" . $tmpWord . "'";
    }

    /**
     * Obtiene la posición de una tupla dependiente de ordenamiento
     *
     * @param string $from Campo de selección
     * @param string $rowNameKey Campo llave
     * @param string $id Identificador de selección
     * @param string $rowOrdenBy Criterio de ordenamiento
     *
     * @return int Posición
     * @throws Doctrine_Connection_Exception
     */
    public static function getPositionOperation($from = '', $rowNameKey = '', $id = '', $rowOrdenBy = '')
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexion = $objDoctrine->getCurrentConnection();
        $row = $conexion->fetchAll("SELECT row FROM (SELECT row_number() OVER(ORDER BY $rowOrdenBy) as row,*
                                    FROM $from) a where $rowNameKey = " . "'" . $id . "';");
        return $row;
    }
}
