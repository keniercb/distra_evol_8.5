<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Ing. Osvaldo M. Gonzalez
 * @copyright Copyright (c) 2013 xetid
 */
class IconosModel
{
    /**
     * @var bool|string
     */
    var $directorio = '../comun/recursos/iconos/configuracion/';

    /**
     * @param bool $directorio
     * @param bool $nomenclador
     */
    public function __construct($directorio = false, $nomenclador = false)
    {
        if ($nomenclador) {
            $this->directorio = '../comun/recursos/iconos/grados/';
        }
        $this->directorio = $directorio ? $directorio : $this->directorio;
    }

    /**
     * Descripción del método: Busca una o varias instancia atendiendo de la tabla iconos
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @return array : Permite buscar uno o varios elemento en la tabla iconos
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIconos()
    {
        if (!file_exists($this->directorio)) {
            return array('cant' => 1, 'datos' => array());
        }
        $d = dir($this->directorio);
        $archivos = array();
        while ($nombreArchivo = $d->read()) {
            if ($nombreArchivo != "." && $nombreArchivo != ".." && $nombreArchivo != ".svn") {
                $valor = explode(".", $nombreArchivo);
                $archivos[] = array(
                    'id' => $nombreArchivo, 'valor' => $valor[0], 'icono' => $this->directorio . $nombreArchivo);
            }
        }

        return (array('cant' => count($archivos), 'datos' => $archivos));
    }
}