<?php

/**
 * Modelo de negocio para gestionar los tipos de nómina.
 *
 * @author Ing. Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad tipo de nómina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class DatConveniosModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomTipoNominaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    
    public function obtenerListadoConvenios($inicio, $limite, $idplantilla)
    {
        $arrayreturn = DatConvenios::obtenerListadoConvenios($inicio, $limite, $idplantilla);
        
        // Paso 1: Calcular la suma de importes por obra
        $sumaPorObra = [];

        foreach ($arrayreturn as $convenio) {
            $obra = $convenio['obra'];
            $importe = $convenio['importe'];
            
            if (isset($sumaPorObra[$obra])) {
                $sumaPorObra[$obra] += $importe;
            } else {
                $sumaPorObra[$obra] = $importe;
            }
        }

        // Paso 2: Asignar el valor de sumaxobra a cada elemento según su obra
        foreach ($arrayreturn as &$convenio) {
            $obra = $convenio['obra'];
            $convenio['sumaxobra'] = $sumaPorObra[$obra];
            $convenio['obra'] = $convenio['obra'] . '-$' . number_format(floatval($sumaPorObra[$obra]), 2) ;
        }


        return $arrayreturn;
    }
    
    public function adicionarConvenioByObra($denominacion, $obra, $importe, $fechainicio, $fechafin, $descripcion, $idplantilla, $identidad, $idnomtipodestajo, $fechainicioperiodo, $fechafinperiodo)
    {
        $return = DatConvenios::adicionarConvenioByObra($denominacion, $obra, $importe, $fechainicio, $fechafin, $descripcion, $idplantilla, $identidad, $idnomtipodestajo, $fechainicioperiodo, $fechafinperiodo);

        return $return;
    }

    public function modificarConvenioByObra($idconvenio, $denominacion, $obra, $importe, $fechainicio, $fechafin, $descripcion){

        $return = DatConvenios::modificarConvenioByObra($idconvenio, $denominacion, $obra, $importe, $fechainicio, $fechafin, $descripcion);

        return $return;
    }

    public function eliminarConvenio($idconvenio){

        $return = DatConvenios::eliminarConvenio($idconvenio);
        
        return $return;
    }
    
    public function obtenerListadoPlantillaNominal($idestructura)
    {
        $arrayplantilla = ConfPlantillaNominal::obtenerListadoPlantillasNominalesActivas($idestructura);
        return $arrayplantilla;
    }
    
    public function obtenerMontoTotalBrigada($idplantilla)
    {
        $datos = DatConvenios::obtenerListadoConvenios($inicio = 0, $limite = 15, $idplantilla);

        foreach ($datos as $key => $value) {
            $sumatoria += $value['importe'];
        }
        
        return $sumatoria;
    }
    
}
