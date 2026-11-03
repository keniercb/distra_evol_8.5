<?php

/*
 *Clase dominio de Recursos.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba   
 * @author Equipo de seguridad UCID.  
 * @version 3.0-0
 */
class CompartimentacionsistemaModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function gestionarSistemasFuncAcc(
        $arraySistemas, 
        $arrayFuncionalidades, 
        $arrayRecursos, 
        $arraySistEliminar, 
        $arrayFuncEliminar, 
        $arrayRecursosEl, 
        $iddominio
    )
    {
        if (count($arraySistemas))
            $this->insertarCompartimentacionObj(
                'DatSistemaCompartimentacion', 
                'idsistema', 
                $iddominio, 
                $arraySistemas
            );
        if ($arrayFuncionalidades)
            $this->insertarCompartimentacionObj(
                'DatFuncionalidadCompartimentacion',
                'idfuncionalidad', 
                $iddominio, 
                $arrayFuncionalidades
            );
        if ($arrayRecursos)
            $this->insertarCompartimentacionObj(
                'DatRecursoCompartimentacion',
                'idrecurso', 
                $iddominio, 
                $arrayRecursos
            );
        if (count($arraySistEliminar))
            DatSistemaCompartimentacion::
            eliminarSistemas($arraySistEliminar, $iddominio);
        if (count($arrayFuncEliminar))
            DatFuncionalidadCompartimentacion::
            eliminarFuncionalidades($arrayFuncEliminar, $iddominio);
        if (count($arrayRecursosEl)) {
            $rolesDominio = SegRolNomDominio::RolesdelDominio($iddominio);
            $rolesDominio = $this->arrayBidimencionalToUnidimencional(
                $rolesDominio
            );
            DatRecursoCompartimentacion::
                eliminarRecursos($arrayRecursosEl, $iddominio);
            DatSistemaSegRolDatFuncionalidadDatAccion::
                eliminarRecursosAutorizadas($arrayRecursosEl, $rolesDominio);
        }
    }

    private function insertarCompartimentacionObj(
        $nameObj, $nameId, $iddominio, $arrayIdObj
    )
    {
        $obj = array();
        foreach ($arrayIdObj as $key => $id) {
            $obj[$key] = new $nameObj();
            $obj[$key]->$nameId = $id;
            $obj[$key]->iddominio = $iddominio;
            $obj[$key]->save();
        }
    }

    private function arrayBidimencionalToUnidimencional($arrayRoles)
    {
        $array = array();
        foreach ($arrayRoles as $rol) {
            $array[] = $rol['idrol'];
        }
        return $array;
    }

}