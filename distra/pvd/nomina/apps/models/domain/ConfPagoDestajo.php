<?php

/**
 * DatConvenios
 *
 * @author Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @copyright UCID
 * @version 1.0
 */
class ConfPagoDestajo extends BaseConfPagoDestajo {

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int       $inicio Inicio de la busqueda.
     * @param int       $limite Limite maximo de la busqueda.
     * @return array    Listado de los datos de los tipos de nómina.
     */   


    public function fnObtenerConfiguracionXIdConfPagoDestajo($idconfpagodestajo)
    {
        return Doctrine::getTable('ConfPagoDestajo')->find($idconfpagodestajo);
    }
    

    public function obtenerListadoConfPagoDestajo($identidad, $start, $limit)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "SELECT * FROM mod_nomina.conf_pagodestajo WHERE identidad = $identidad order by orden ASC limit {$limit} offset {$start};";
        $r = $conn->fetchAll($sql);

        return $r;
    }

    public function fnObtenerOrdenDisponible($identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT MAX(orden)  as orden FROM  mod_nomina.conf_pagodestajo
            where identidad = $identidad";
        $r = $conn->fetchAll($sql);
        $r[0]['orden'] = !empty($r) ? $r[0]['orden'] + 1 : 1;
        return $r[0];
    }

    public function fnAdicionarConfCamposConfiguracion($params)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $existecampo = $this->fnBuscarCampoXDenominacion($params['denominacion']);

        if ($existecampo == 0) {
            $sql = "INSERT INTO mod_nomina.conf_pagodestajo(denominacion, tipoentrada, entrada, idformula, descripcion, identidad, orden)
                    VALUES (
                    '" . $params['denominacion'] . "',
                    '" . $params['tipoentrada'] . "',
                    '" . $params['entrada'] . "',
                    {$params['idformula']},
                    '" . $params['descripcion'] . "',
                    {$params['identidad']},
                    {$params['orden']}) returning idconfpagodestajo;";
            $r = $conn->fetchAll($sql);
            return 1;
        } else
            return 2;
    }

    public function fnBuscarCampoXDenominacion($denominacion)
    {
        try {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $sql = "SELECT COUNT(cpd.*)
                FROM  mod_nomina.conf_pagodestajo cpd
                WHERE cpd.denominacion ilike '%{$denominacion}%'";
            $result = $conn->fetchOne($sql);
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function fnModificarCamposConfiguracion($params)
    {
        $obj = $this->fnObtenerConfiguracionXIdConfPagoDestajo($params['idconfpagodestajo']);
        $obj->denominacion = $params['denominacion'];
        $obj->tipoentrada = $params['tipoentrada'];
        $obj->entrada = $params['entrada'];
        $obj->idformula = $params['idformula'];
        $obj->descripcion = $params['descripcion'];
        $obj->identidad = $params['identidad'];
        $obj->orden = $params['orden'];
        $obj->save();
        return 1;
    }

    public function eliminandoCamposConfiguracion($idconfpagodestajo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "DELETE FROM 
            mod_nomina.conf_pagodestajo 
            WHERE 
            idconfpagodestajo = $idconfpagodestajo;";
        $conn->execute($sql);

        return 'ok';
    }

    public function obtenerListadoObraEntidad($identidad, $limite, $inicio)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT nod.*, node.identidad, node.activo
            FROM mod_nomina.nom_obrasdestajo nod
            left JOIN mod_nomina.nom_obrasdestajoentidad node on (node.idnomobrasdestajo = nod.idnomobrasdestajo)
            
            WHERE nod.estado = '1' AND node.activo = 1 AND node.identidad = $identidad and (fechafin is null or fechafin > now())";
        $result = $conn->fetchAll($sql);

        return $result;
    }
    
    
}
