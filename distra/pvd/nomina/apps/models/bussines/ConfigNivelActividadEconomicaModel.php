<?php

/**
 * Modelo de negocio para gestionar las configuraciones de los niveles de actividades economicas.
 *
 * @author Ing. Dainier Velázquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses ConfigNivelActividadEconomicaModel.
 * @copyright UCID
 * @version 1.0
 */
class ConfigNivelActividadEconomicaModel extends ZendExt_Model
{
    /**
     * Constructor de la clase.
     */
    public function ConfigNivelActividadEconomicaModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerListadoNivelesActividadEconomica($idestructura, $inicio = 0, $limite = 10)
    {
        return ConfigNivelActividadEconomica::obtenerListadoNivelesActividadEconomica($idestructura, $inicio, $limite);
    }

    public function adicionarNivelActividadEconomica($idestructura, $idtiponomina, $idnivelactiveconom)
    {
        $objDomain = new ConfigNivelActividadEconomica();
        if (count($objDomain->existeUnMismoIdTipoDeNomina($idestructura, $idtiponomina)) > 0) {
            return 'EXISTETIPONOMINA';
        } else {
            $objDomain->idestructura = $idestructura;
            $objDomain->idtiponomina = $idtiponomina;
            $objDomain->idcentrogrupo = $idnivelactiveconom;
            $objDomain->save();
            return 'ok';
        }
    }

    public function modificarNivelActividadEconomica($idconfiguracionnivelae, $idestructura, $idtiponomina, $idnivelactiveconom)
    {
        //Obteniendo todos los tipos de nominas
        $objDomainTodos = new ConfigNivelActividadEconomica();
        $mismoTipoNomina = $objDomainTodos->existeUnMismoIdTipoDeNomina($idestructura, $idtiponomina);
        //Obteniendo el tipo de nómina a modificar.
        $objDomain = ConfigNivelActividadEconomica::obtenerListadoNivelesActividadEconomicaDadoId($idconfiguracionnivelae);
        if (count($mismoTipoNomina) > 0 &&  $mismoTipoNomina[0]['idnivelactiveconom'] != $idconfiguracionnivelae) {
            return 'EXISTETIPONOMINA';
        } else {
            $objDomain->idestructura = $idestructura;
            $objDomain->idnivelactiveconom = $idconfiguracionnivelae;
            $objDomain->idtiponomina = $idtiponomina;
            $objDomain->idcentrogrupo = $idnivelactiveconom;
            $objDomain->save();
            return 'ok';
        }
    }

    public function eliminarNivelActividadEconomica($idconfiguracionnivelae)
    {
        $objDomain = new ConfigNivelActividadEconomica();
        $obj = $objDomain->obtenerListadoNivelesActividadEconomicaDadoId($idconfiguracionnivelae);
        $obj->delete();
        return 'ok';
    }

}
