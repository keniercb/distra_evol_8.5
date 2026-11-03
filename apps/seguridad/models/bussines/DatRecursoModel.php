<?php

/**
 * Clase de negocio de recursos.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class DatRecursoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarRecurso(
        $denominacion, $abreviatura, $descripcion, 
        $idfuncionalidad, $iddominio,$icono
        )
    {
        $datRecurso = new DatRecurso();
        $datRecurso->denominacion = $denominacion;
        $datRecurso->abreviatura = $abreviatura;
        $datRecurso->descripcion = $descripcion;
        $datRecurso->icono = $icono;
        $datRecurso->idfuncionalidad = $idfuncionalidad;
        $datRecurso->iddominio = $iddominio;
        $datRecurso->save();
        $objRecursoComp = new DatRecursoCompartimentacion();
        $objRecursoComp->idrecurso = $datRecurso->idrecurso;
        $objRecursoComp->iddominio = $iddominio;
        $objRecursoComp->save();
        return $datRecurso->idrecurso;
    }

    public function modificarRecurso(
        $idrecurso, $denominacion, $abreviatura, $descripcion, 
        $idfuncionalidad, $icono
    )
    {
        $datRecurso = Doctrine::getTable('DatRecurso')->find($idrecurso);
        $datRecurso->denominacion = $denominacion;
        $datRecurso->abreviatura = $abreviatura;
        $datRecurso->descripcion = $descripcion;
        $datRecurso->icono = $icono;
        $datRecurso->save();
    }

    public function eliminarRecursos($arrayRecursosElim)
    {
        DatRecurso::eliminarRecursos($arrayRecursosElim);
    }

    public function actualizarPermisos(
        $arrayObjectInsert, $idrecurso, $idfuncionalidad
    )
    {

            Doctrine_Manager::getInstance()->getCurrentConnection();
            $arrayRecursos = DatSistemaSegRolDatFuncionalidadDatAccion::
            obtenerRecursosAsignados($idrecurso);
            $roleList = array();
            if (count($arrayObjectInsert) > 0) {
                foreach ($arrayObjectInsert as $obj) {
                    $obj->save();
                    if (count($arrayRecursos) > 0) {
                        foreach ($arrayRecursos as $key => $value) {
                            $objSistRolFunAccRec[$key] = new DatSistemaSegRolDatFuncionalidadDatAccion();
                            $objSistRolFunAccRec[$key]->idaccion = $obj->idaccion;
//                          $objSistRolFunAccRec[$key]->idfuncionalidad = $idfuncionalidad;
                            $objSistRolFunAccRec[$key]->idfuncionalidad = $value['idfuncionalidad'];
                            $objSistRolFunAccRec[$key]->idrol = $value['idrol'];
                            $objSistRolFunAccRec[$key]->idsistema = $value['idsistema'];
                            $objSistRolFunAccRec[$key]->idrecurso = $idrecurso;
                            $objSistRolFunAccRec[$key]->save();

                            if(!in_array($value['idrol'],$roleList)){
                                $roleList[] = $value['idrol'];
                            }

                        }
                    }
                }
                if(count($roleList) > 0)
                    self::updateAcl($roleList/*, $userList*/);
            }
    }

    public function updateAcl($roleList/*, $userList*/)
    {
        $userList = array();
        //Ejecutando tarea de actualización de las ACL de los usuarios
        //con sessiones activas.

            $securityConfig = new Zend_Config_Ini(
                Zend_Registry::get('config')->security_config, 'trace'
            );
            if ($securityConfig->background) {
                $taskRunner = new Amqp_Task_Mgr();
                $taskRunner->runTask('updateAcl', array($roleList, $userList));
            } else {

                $sessionAclUpdateObj = new ZendExt_Session_Acl_Update();
                $sessionAclUpdateObj->init($roleList, $userList);
            }

    }

    public function cargarSistFuncAcc($arrayParams)
    {
        $idnodo = isset($arrayParams['node']) ? $arrayParams['node'] : 0;
        $idsistema = $arrayParams['idsistema'];
        $idfuncionalidad = $arrayParams['idfuncionalidad'];
        $opcion = $arrayParams['opcion'];
        $idrecurso = ($arrayParams['idrecurso']) 
            ? $arrayParams['idrecurso'] : 0;
        $iddominio = $this->global->Perfil->iddominio;
        $sistemas = array();
        $arrayIdSistemasRecurso = array();
        $arrayRecursos = DatRecurso::obtenerSistemasConRecursos($idrecurso);
        if (count($arrayRecursos) > 0)
            //Listado de identificadores de sistemas que sus 
            //funcionalidades tienen acciones en ese recurso.
        $arrayIdSistemasRecurso = SegUtil::convertToUnidimensional(
            DatSistema::getIDSistemaBySql(self::getSqlPart($arrayRecursos)), 
            'idsistema'
        );
        $sistemas = DatSistema::loadSystems($idsistema);
        $contador = 0;
        $sistFunArr = array();
        if (count($sistemas) > 0) {
            foreach ($sistemas as $valor) {
                $sistFunArr[$contador]['id'] = $valor['id'];
                $sistFunArr[$contador]['idsistema'] = $valor['idsistema'];
                if (array_intersect(
                    array($valor['idsistema']), $arrayIdSistemasRecurso
                )
                )
                    $sistFunArr[$contador]['text'] = 
                    "<font style=\"color:green; font-weight:bold;\">"
                    . "{$valor['text']}</font>";
                else
                    $sistFunArr[$contador]['text'] = $valor['text'];
                $sistFunArr[$contador]['type'] = $valor['type'];
                $contador++;
            }
        }
        if ($idsistema) {
            $funcionalidad = DatFuncionalidad::loadFuncionalitys(
                $idnodo, $idsistema, $iddominio, $idrecurso
            );
            if (count($funcionalidad) > 0) {
                foreach ($funcionalidad as $valor) {
                    $sistFunArr[$contador]['id'] = $valor['id'];
                    $sistFunArr[$contador]['idfuncionalidad'] = 
                        $valor['idfuncionalidad'];
                    $sistFunArr[$contador]['text'] = $valor['text'];
                    $sistFunArr[$contador]['type'] = $valor['type'];
                    $contador++;
                }
            }
        }
        if ($idfuncionalidad) {
            return DatAccion::loadActionsResourses(
                $idnodo, $idfuncionalidad, $idrecurso, $opcion
            );
        }
        return $sistFunArr;
    }

    static private function getSqlPart($array)
    {
        $i = 1;
        $cantidad = count($array);
        $sqlWHERE = '';
        foreach ($array as $fila) {
            if ($i == $cantidad)
                $sqlWHERE .= " ( lft <= {$fila['lft']} "
                . "AND rgt >= {$fila['rgt']} ) ";
            else
                $sqlWHERE .= " ( lft <= {$fila['lft']} "
                . "AND rgt >= {$fila['rgt']} ) OR";
            $i++;
        }
        return $sqlWHERE;
    }

}