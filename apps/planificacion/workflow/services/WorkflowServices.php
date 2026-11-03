<?php

class WorkflowServices extends ZendExt_Model
{

    public function EstadosVerDoc($idusuario, $idtipodoc)
    {
//        print_r('esaaa');die;
        $objestado = new DatEstado();
        $estados = $objestado->EstadosVer($idusuario, $idtipodoc);
        return $estados;
    }

    public function EstadoPorDefecto($idusuario, $idtipodoc)
    {
        $objestado = new DatEstado();
        $estados = $objestado->EstadoPorDefecto($idusuario, $idtipodoc);
        $result = ZendExt_ClassStandard::ArrayObject($estados);
        return $result;
    }

    public function EstadosModDoc($idusuario, $idtipodoc, $idestadoinicial)
    {
        $objestado = new DatEstado();
        $estados = $objestado->EstadosMod(
            $idusuario, $idtipodoc, $idestadoinicial
        );
        $result = ZendExt_ClassStandard::ArrayObject($estados);
        return $result;
    }

    //devuelve la tupla donde coincida $idtipodoc,$idestado, (Ariadna Rendon)
    public function ObtenerConfDocEstado($idtipodoc, $idestado)
    {
        $objconfdocest = new ConfDocDatEstado();
        $confdocestado = $objconfdocest->VerificarAsociacionDocumentoEstado(
            $idtipodoc, $idestado
        );
        $result = ZendExt_ClassStandard::ArrayObject($confdocestado);
        return $result;
    }

    public function Ejecutar($iduser, $idestadoi, $idestadof, $idtdoc, $obj)
    {
        $utl = new UtilidadesModel();
        $resp = $utl->EjecutarWorkflow(
            $iduser, $idestadoi, $idestadof, $idtdoc, $obj
        );
        return $resp;
    }

    public function generaControl($idestado, $idtipodoc, $idusuariosession)
    {
        $resp = ConfDocDatEstado::generaControl(
            $idestado, $idtipodoc, $idusuariosession
        );
        return $resp;
    }

    public function EjecutarPostCondiciones(
        $iduser, $idestadoi, $idestadof, $idtdoc, $obj, $idsub
    ) {
        $utl = new UtilidadesModel();
        $resp = $utl->Poscondiciones(
            $idtdoc, $idestadoi, $idestadof, $iduser, $obj, $idsub
        );
        return $resp;
    }

    public function GetControlDeEstado($idestado, $idtipodoc)
    {
        $objestado = new DatEstado();
        $estados = $objestado->GetControlDeEstado($idestado, $idtipodoc);
        $result = ZendExt_ClassStandard::ArrayObject($estados);
        return $result;
    }
    
    public function DenomEstado($idestado)
    {
        $objestado = new DatEstado();
        $estados = $objestado->DenomEstado($idestado);
        $result = ZendExt_ClassStandard::ArrayObject($estados);
        return $result;
    }

    public function EstadosSiguientesDadoEstado($idestado)
    {
        $objtrans = new DatTransicion();
        $result[0] = $idestado;
        if (isset($result[0])) {
            foreach ($result as $estado) {
                $estadosiguientes = $objtrans->EstadosSiguientesDadoEstadoBD(
                    $estado
                );
                foreach ($estadosiguientes as $e) {
                    //para comprobar que no se repita el estado en el 
                    //array que se va devolver
                    if (!in_array($e, $result)) {
                        $result += $e;
                    }
                }
            }
        }
        return $result;
    }

    public function EstadosAnterioresDadoEstado($idestado)
    {
        $respuesta = array();
        $estadosant = array();
        $arrayestados = $this->EstadosSiguientesDadoEstado($idestado);
        $objtrans = new DatTransicion();
        $result = $objtrans->EstadosAnterioresDadoEstadoBD(
            $idestado, $arrayestados
        );
        if (isset($result[0])) {
            foreach ($result as $estado) {
                $id = $estado['idestadoinicial'];
                $estadosanteriores []
                    = $objtrans->EstadosAnterioresDadoEstadoBD(
                    $id, $arrayestados
                );
                foreach ($estadosanteriores as $e) {
                    //para comprobar que no se repita el estado en el 
                    //array que se va devolver
                    if (!in_array($e, $result)) {
                        $respuesta = $e;
                    }
                }
            }
        }
        foreach ($respuesta as $value) {
            $estadosant [] = $value['idestadoinicial'];
        }
        return $estadosant;
    }

    public function obtenerPermisosPostCondiciones($idtransicion, $idusuario)
    {
        $existeconf = Doctrine::getTable('DatPostconacceso')->findByDql(
            "idtransicion = $idtransicion AND idusuario = $idusuario"
        );
        if (isset($existeconf[0]->idpostconacceso)
            && $existeconf[0]->idpostconacceso != null
            && $existeconf[0]->idpostconacceso != ''
        ) {
            $permisomodificar = $existeconf[0]->modificar;
        }
        return $permisomodificar;
    }

    public function obtenerPermisosPostAccion(
        $idusuario, $idestado, $idtipoelemento
    ) {
        $modificar = 1;
        $eliminar = 1;
        $arrayobjpostconacceso = Doctrine::getTable('DatPostconacceso')
            ->findByDql("idestado = $idestado ");
        if (isset($arrayobjpostconacceso[0]->idpostconacceso)
            && $arrayobjpostconacceso[0]->idpostconacceso != null
            && $arrayobjpostconacceso[0]->idpostconacceso != ''
        ) {
            $modificar = 0;
            $eliminar = 0;
            $arrayobjpostconacceso = Doctrine::getTable('DatPostconacceso')
                ->findByDql("idestado = $idestado AND idusuario = $idusuario");
            if (isset($arrayobjpostconacceso[0]->idpostconacceso)
                && $arrayobjpostconacceso[0]->idpostconacceso != null
                && $arrayobjpostconacceso[0]->idpostconacceso != ''
            ) {
                $modificar = $arrayobjpostconacceso[0]->modificar;
                $eliminar = $arrayobjpostconacceso[0]->eliminar;
            }
        }
        $arraypermisos['modificar'] = $modificar;
        $arraypermisos['eliminar'] = $eliminar;
        return $arraypermisos;
    }

    public function getJSEstado()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/workflow/views/scripts/gestionarestado/obtenerJSEstados.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }

    public function getJSTransicion()
    {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirphtml = $dirapps
            . 'planificacion/workflow/views/scripts/gestionarflujodetrabajo/obtenerJSFlujodeTrabajo.phtml';
        $js = file_get_contents($dirphtml);
        return $js;
    }
}


