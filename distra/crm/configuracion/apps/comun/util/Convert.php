<?php

/**
 * Clase para realizar conversi&oacute;n entre arreglos y objetos.
 *
 * @author     Ing. Miguel Diaz Riveaux.
 * @package    Configuración
 * @subpackage Común/Útil
 * @copyright  XETID.
 * @version    1.0
 */
final class Convert
{

    /**
     * @param stdClass $objStdClass Objeto de tipo stdClass
     *
     * @return array Arreglo convertido a partir del objeto de tipo stdClass dado.
     */
    static public function ObjectToArray(stdClass $objStdClass)
    {
        # Typecast to (array) automatically converts stdClass -> array.
        $objStdClass = (array)$objStdClass;

        # Iterate through the former properties looking for any stdClass properties.
        # Recursively apply (array).
        foreach ($objStdClass as $key => $value) {
            if (is_object($value) && get_class($value) === 'stdClass') {
                $objStdClass[$key] = self::ObjectToArray($value);
            } else {
                if (is_array($value)) {
                    $objStdClass[$key] = self::ObjectToArray($value);
                }
            }
        }
        return $objStdClass;
    }

    /**
     * @param array $array Array para convertilo en un objeto de tipo stdClass.
     *
     * @return array Objeto de tipo stdClass convertido a partir del arreglo dado.
     */
    static public function ArrayToObject(array $array)
    {
        # Iterate through our array looking for array values. If found recurvisely call itself.
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $array[$key] = self::ArrayToObject($value);
            }
        }
        # Typecast to (object) will automatically convert array -> stdClass
        return (object)$array;
    }

}