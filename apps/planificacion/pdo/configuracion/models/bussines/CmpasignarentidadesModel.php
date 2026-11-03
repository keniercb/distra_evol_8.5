<?php

/**
 * @author    Jesus Ariel Guerra Lopez
 * @version   3.0.0
 * @copyright XETID, ERP-CUBA
 */
class CmpasignarentidadesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function adicionarAsocUserEstr($parametros)
    {
        if (isset($parametros['relacionActual'])) {
            $obj = $parametros['relacionActual'];
            $obj->idusuario = $parametros['idusuario'];
            $obj->idestructura = $parametros['idestructura'];
            $obj->autor = $parametros['autor'];
            $obj->fechaasociacion = $parametros['fecha_actual'];
            $obj->save();
        } else {
            $obj = new DatUsuarioEstructura();
            $obj->idusuario = $parametros['idusuario'];
            $obj->idestructura = $parametros['idestructura'];
            $obj->autor = $parametros['autor'];
            $obj->fechaasociacion = $parametros['fecha_actual'];
            $obj->save();
        }
        return 1;
    }

    public function verificarSiExisteUserEstrutura($idusuario)
    {
        $existeuser = Doctrine::getTable('DatUsuarioEstructura')->findByDql(
            "idusuario = $idusuario"
        );
        if ($existeuser[0]->idusuario != null) {
            $objuser = new DatUsuarioEstructura();
            $params['sql'] = $objuser->obtenerUserEstructura(
                $existeuser[0]->idusuario
            );
            $params['flag'] = 'false';
            $params['resp'] = 2;
            return $params;
        }
    }

    public function verificarSiExisteEstruturaUser($idestructura)
    {
        $existeestr = Doctrine::getTable('DatUsuarioEstructura')->findByDql(
            "idestructura = $idestructura"
        );
        if ($existeestr[0]->idestructura != null) {
            $objestruc = new DatUsuarioEstructura();
            $params['sql'] = $objestruc->obtenerEstructuraUser(
                $existeestr[0]->idestructura
            );
            $params['flag'] = 'false';
            $params['resp'] = 3;
            return $params;
        }
    }

    public function actualizarUserEstrc($parametros)
    {
        $objactividad = new DatUsuarioEstructura();
        if (isset($parametros['idrelacionestruc'])) {
            $relacion = Doctrine_Core::getTable('DatUsuarioEstructura')->find(
                $parametros['idrelacionestruc']
            );
            $relaciona = Doctrine_Core::getTable('DatUsuarioEstructura')->find(
                $parametros['idrelacion']
            );
            self::Eliminar($relacion);
            self::Eliminar($relaciona);
            $obj = new DatUsuarioEstructura();
            $obj->idusuario = $parametros['idusuario'];
            $obj->idestructura = $parametros['idestructura'];
            $obj->autor = $parametros['autor'];
            $obj->fechaasociacion = $parametros['fecha_actual'];
            $obj->save();
            $respuesta = 1;
        } else {
            $respuesta = $objactividad->actualizarUserEstrc($parametros);
        }
        return $respuesta;
    }

    public function Eliminar(DatUsuarioEstructura $obj)
    {
        $obj->delete();
    }

    public function verificarUsoPermiso($obj)
    {
        $usopermiso = Doctrine::getTable('DatPermiso')->findByDql(
            "(idppara = $obj->idusuario or idpsobre = $obj->idusuario) 
                and (tipoppara = '4' or tipopsobre = '4')"
        );
        if ($usopermiso[0]->idpermiso != null) {
            return false;
        }
        return true;
    }

    public function listarAsocUserEstruc($parametros)
    {
        $result = DatUsuarioEstructura::listarAsocUserEstruc($parametros);
        foreach ($result->data as $key => $value) {
            $estructura = $parametros['integrator']->metadatos->DameEstructura(
                $value['idestructura']
            );
            $objpermisos = new GestionarpermisosModel();
            $usuario = $objpermisos->DameDenominacion($value['idusuario'], 'usuario');
            /*$usuario = $parametros['integrator']->seguridad->nombreUsuario(
                $value['idusuario']
            );*/
            $autor = $objpermisos->DameDenominacion($value['autor'], 'usuario');
            /*$autor = $parametros['integrator']->seguridad->nombreUsuario(
                $value['autor']
            );*/
            $result->data[$key]['estructura'] = $estructura[0]->denominacion;
            $result->data[$key]['autor'] = $autor;
            $result->data[$key]['iconestruc'] = $estructura[0]->icon;
            $result->data[$key]['usuario'] = $usuario;
        }
        return $result;
    }

    public function activarDesactivarRelacion($parametros)
    {
        if ($parametros['accion'] == 'activar') {
            $actdesact = 1;
        } else {
            $actdesact = 0;
        }
        $objrelacion = Doctrine::getTable('DatUsuarioEstructura')->find(
            $parametros['idrelacion']
        );
        $objrelacion->activo = $actdesact;
        $objrelacion->save();
        return 1;
    }

    public function buscarinvolucrados($idusuario, $denominacion, $permiso)
    {
        $objdatpermiso = new DatPermiso();
        $resultado = $objdatpermiso->ObtPermisosDado_UserDenSub(
            $idusuario, $denominacion, $subordinado = 1, $permiso
        );
        foreach ($resultado as $key => $permiso) {
            $arrausersdomain[$key]['id'] = $permiso['idpsobre'];
            $arrausersdomain[$key]['text'] = $permiso['denpsobre'];
            $arrausersdomain[$key]['idusuario'] = $permiso['idpsobre'];
            $arrausersdomain[$key]['draggable'] = false;
            /*if ($flaguser['flag'] != 'false') {
                $arrausersdomain[$key]['checked'] = false;
            }*/
            $arrausersdomain[$key]['iconCls'] = 'usuario';
            $arrausersdomain[$key]['leaf'] = true;
            $arrausersdomain[$key]['tipo'] = 1;
        }
        return $arrausersdomain;
    }

    public function obtenerArbolRelacionesAutor(
        $idautor, $estamodificando, $idnomenclador
    )
    {
        $denoentidades = array();
        $cont = 0;
        $objUsuarioEstructura = new DatUsuarioEstructura();
        $entidades = $objUsuarioEstructura->obtenerRelacionesAutor($idautor);
        foreach ($entidades as /*$key => */$value) {
            $checked = false;
            if ($estamodificando == 1) {
                $espublicoparaestructura = DatEstructuraNomenclador::
                ExisteRelacionEstructuraNomenclador(
                    $value['idestructura'], $idnomenclador
                );
                if ($espublicoparaestructura) {
                    $checked = true;
                }
            }
            $entidad = $this->integrator->metadatos->DameEstructura(
                $value['idestructura']
            );
            $denoentidades[]['text'] = $entidad[0]->denominacion;
            $denoentidades[$cont]['id'] = $value['idestructura'];
            $denoentidades[$cont]['icon'] = $entidad[0]->icon;
            $denoentidades[$cont]['checked'] = $checked;
            $denoentidades[$cont]['idusuario'] = $value['idusuario'];
            $denoentidades[$cont]['idrelacion']
                = $value['idusuarioestructura'];
            $denoentidades[$cont]['idestructura'] = $value['idestructura'];
            $denoentidades[$cont]['tipo'] = 2;
            $denoentidades[$cont++]['leaf'] = true;
        }
        return $denoentidades;
    }

}
