<?php

class NomCondicionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function CargarCondiciones($idestado, $tipocondicion)
    {
        $arraycondiciones = NomCondicion::ObtenerCondicionesPorTipo(
            $tipocondicion
        );
        $idcondicion = $arraycondiciones[0]['idcondicion'];
        $existeconf = Doctrine::getTable('DatPostconacceso')->findByDql(
            "idestado = $idestado AND idcondicion = $idcondicion"
        );
        if (isset($existeconf[0]->idpostconacceso)
            && $existeconf[0]->idpostconacceso != null
            && $existeconf[0]->idpostconacceso != ''
        ) {
            $arraycondiciones[0]['ejecutar'] = true;
        }
        return $arraycondiciones;
    }

    public function CargarUsuariosPre(
        $idusuario, $idtransicion, $estamodificando
    ) 
    {
        $idusuario = $this->global->Perfil->idusuario;
        $arraysubord = array();
        $arraysubordinados
            = $this->integrator->planificacion->UsuariosSubordinados(
            $idusuario
        );
        $cont = 0;
        if (isset($arraysubordinados[0])) {
            foreach ($arraysubordinados as $subordinado) {
                $arraysubord[$cont]['idelemento'] = $subordinado['idpsobre'];
                $arraysubord[$cont]['denominacion'] = $subordinado['denpsobre'];
                $arraysubord[$cont]['tipo'] = 1;
                $arraysubord[$cont]['chequear'] = 0;
                $arraysubord[$cont]['chequearinicial'] = 0;
                $cont++;
            }
        }
        $arraygruposactivos
            = $this->integrator->planificacion->ObtenerGruposDeUsuarios(
            $idusuario, $estado = 1
        );
        if (isset($arraygruposactivos[0])) {
            foreach ($arraygruposactivos as $grupo) {
                $arraysubord[$cont]['idelemento'] = $grupo['idgrupo'];
                $arraysubord[$cont]['denominacion'] = $grupo['dengrupo'];
                $arraysubord[$cont]['tipo'] = 0;
                $arraysubord[$cont]['chequear'] = 0;
                $arraysubord[$cont]['chequearinicial'] = 0;
                $cont++;
            }
        }
        return $arraysubord;
    }


    public function CargarUsuariosPost($idusuario, $idestado, $parametros)
    {
        $cont = 0;
        $arraysubord = array();
        $arraysubordinados
            = $this->integrator->planificacion->UsuariosSubordinados(
            $idusuario
        );
        if (isset($arraysubordinados[0])) {
            foreach ($arraysubordinados as $key => $subordinado) {
                $modificar = false;
                $eliminar = false;
                $idsubordinado = $subordinado['idpsobre'];;
                $existeconf = Doctrine::getTable('DatPostconacceso')->findByDql(
                    "idestado = $idestado AND idusuario = $idsubordinado"
                );
                if (isset($existeconf[0]->idpostconacceso)
                    && $existeconf[0]->idpostconacceso != null
                    && $existeconf[0]->idpostconacceso != ''
                ) {
                    if ($existeconf[0]->modificar == 1) {
                        $modificar = true;
                    }
                    if ($existeconf[0]->eliminar == 1) {
                        $eliminar = true;
                    }
                }
                $arraysubord[$cont]['idusuario'] = $subordinado['idpsobre'];
                $arraysubord[$cont]['tipo'] = 1;
                $arraysubord[$cont]['denominacion'] = $subordinado['denpsobre'];
                $arraysubord[$cont]['modificar'] = $modificar;
                $arraysubord[$cont]['eliminar'] = $eliminar;
                $arraysubord[$cont]['modificarinicial'] = $modificar;
                $arraysubord[$cont]['eliminarinicial'] = $eliminar;
                $cont++;
            }
        }
        $modificar = false;
        $eliminar = false;
        $existeconf = Doctrine::getTable('DatPostconacceso')->findByDql(
            "idestado = $idestado AND idusuario = $idusuario"
        );
        if (isset($existeconf[0]->idpostconacceso)
            && $existeconf[0]->idpostconacceso != null
            && $existeconf[0]->idpostconacceso != ''
        ) {
            if ($existeconf[0]->modificar == 1) {
                $modificar = true;
            }
            if ($existeconf[0]->eliminar == 1) {
                $eliminar = true;
            }
        }
        $arraysubord[$cont]['idusuario'] = $idusuario;
        $arraysubord[$cont]['tipo'] = 1;
        $arraysubord[$cont]['denominacion']
            = $this->integrator->seguridad->nombreUsuario($idusuario);
        $arraysubord[$cont]['modificar'] = $modificar;
        $arraysubord[$cont]['eliminar'] = $eliminar;
        $arraysubord[$cont]['modificarinicial'] = $modificar;
        $arraysubord[$cont++]['eliminarinicial'] = $eliminar;
//        $entidades = $parametros->integrator->seguridad->getIdsEntityByUser(
//            $idusuario
//        );
//        if (isset($entidades[0])) {
//            foreach ($entidades as $key => $value) {
//                $modificar = false;
//                $eliminar = false;
//                $existeconfestruct = Doctrine::getTable(
//                    'DatPostconaccesoestructura'
//                )->findByDql("idestado = $idestado AND idestructura = $value");
//                if (isset($existeconfestruct[0]->idpostconacceso)
//                    && $existeconfestruct[0]->idpostconacceso != null
//                    && $existeconfestruct[0]->idpostconacceso != ''
//                ) {
//                    if ($existeconfestruct[0]->modificar == 1) {
//                        $modificar = true;
//                    }
//                    if ($existeconfestruct[0]->eliminar == 1) {
//                        $eliminar = true;
//                    }
//                }
//                $aux = Array();
//                $aux[] = $value;
//                $arrayidcargos
//                    = $this->integrator->metadatos->obtenerCargosEstructuraInmediatos(
//                    $aux, $parametros->iddominio
//                );
//                if (count($arrayidcargos) > 0) {
//                    $entidad
//                        = $parametros->integrator->metadatos->DameEstructura(
//                        $value
//                    );
//                    if ($entidad[0]->idtipo != 7) {
//                        $arraysubord[$cont]['idestructura'] = $value;
//                        $arraysubord[$cont]['tipo'] = 2;
//                        $arraysubord[$cont]['denominacion']
//                            = $entidad[0]->denominacion;
//                        $arraysubord[$cont]['modificar'] = $modificar;
//                        $arraysubord[$cont]['eliminar'] = $eliminar;
//                        $arraysubord[$cont]['modificarinicial'] = $modificar;
//                        $arraysubord[$cont++]['eliminarinicial'] = $eliminar;
//                    }
//                }
//            }
//        }
        return $arraysubord;
    }
    
}

