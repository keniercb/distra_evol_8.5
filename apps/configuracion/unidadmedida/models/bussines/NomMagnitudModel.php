<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class NomMagnitudModel extends ZendExt_Model
{

    /**
     * Constuctor de la clase
     */
    public function setUp() 
    {
        parent::ZendExt_Model();
    }

    /**
     * Insertar y modificar magnitud
     *
     * @param NomMagnitud $nomcategoriaunidadmedida Nomenclador magnitud
     * 
     */
    public function insertar_modificar_nom_magnitud(NomMagnitud $nomcategoriaunidadmedida) 
    {
        $auxcategoriaum = Doctrine::getTable('NomMagnitud')->find($nomcategoriaunidadmedida->idmagnitud);
        if ($auxcategoriaum) {
            $auxcategoriaum->denominacionmagnitud = $nomcategoriaunidadmedida->denominacionmagnitud;
            $auxcategoriaum->descripcionmagnitud = $nomcategoriaunidadmedida->descripcionmagnitud;
            $auxcategoriaum->fechafin = $nomcategoriaunidadmedida->fechafin;
            $auxcategoriaum->fechainicio = $nomcategoriaunidadmedida->fechainicio;
            $auxcategoriaum->save();
        } else {
            $nomcategoriaunidadmedida->save();
        }
    }

    /**
     * Deshabilitar magnitud
     *
     * @param object $nommagnitud Objeto magnitud
     */
    public function deshabilitarMagnitud($nommagnitud) 
    {
        $nommagnitud = Doctrine::getTable('NomMagnitud')->find($nommagnitud->idmagnitud);

        $nommagnitud->fechafin = date('d/m/Y', strtotime('-1 day'));

        if (strtotime($nommagnitud->fechainicio) > strtotime($nommagnitud->fechafin)) {
            $nommagnitud->fechainicio = date('d/m/Y', strtotime('-1 day'));
        }
        $nommagnitud->save();

        $fechaActual = date('d/m/Y');

        $unidadesMedidas = Doctrine::getTable('NomUnidadmedida')
        ->findBy('idmagnitud', $nommagnitud->idmagnitud, Doctrine_Core::HYDRATE_RECORD);
        $dc = Doctrine_Collection::create('NomUnidadmedida');
        foreach ($unidadesMedidas as $index => $valor) {
            if ($valor->fechafin) {
                if ($valor->fechafin >= $fechaActual && $valor->fechainicio <= $fechaActual) {
                    $valor->fechafin = date('d/m/Y', strtotime('-1 day'));
                    if ($valor->fechainicio > $valor->fechafin)
                        $valor->fechainicio = date('d/m/Y', strtotime('-1 day'));
                }
            } else if ($valor->fechainicio <= $fechaActual) {
                $valor->fechafin = date('d/m/Y', strtotime('-1 day'));
                if ($valor->fechainicio > $valor->fechafin)
                    $valor->fechainicio = date('d/m/Y', strtotime('-1 day'));
            }
                
            $dc[$index] = $valor;
        }
        $dc->save();
    }

    /**
     * Eliminar nomenclador magnitud
     *
     * @param object $nommagnitud Objeto de tipo magnitud
     * @return boolean Devuelve verdadero en caso de eliminar la magnitud falso en otro caso
     * @throws Doctrine_Exception $de
     */
    public function eliminarnom_magnitud($nommagnitud) 
    {
        try {
            $nommagnitud = Doctrine::getTable('NomMagnitud')->find($nommagnitud->idmagnitud);
            $nommagnitud->delete();
            return true;
        } catch (Doctrine_Exception $de) {
            $de->getMessage();
            return false;
        }
    }

}
