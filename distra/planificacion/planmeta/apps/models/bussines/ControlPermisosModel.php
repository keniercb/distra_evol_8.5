<?php

class ControlPermisosModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    //metodo para cargar las Funcionalidades asociadas al subsistema Planificación material
    public function cargarFuncionalidades($arrayfuncionalidades) {
        $arrayfuncsnoasociadas = array();
        if (isset($arrayfuncionalidades[0])) {
            $posicion = 0;
            foreach ($arrayfuncionalidades as $funcionalidad) {
                if ($funcionalidad['visible'] == true) {
                    $idfuncionalidad = $funcionalidad['idfuncionalidad'];
                    $arrayfuncsnoasociadas[$posicion]['id'] = $idfuncionalidad;
                    $arrayfuncsnoasociadas[$posicion]['text'] = $funcionalidad['text'];
                    $arrayfuncsnoasociadas[$posicion]['leaf'] = true;
                    $arrayfuncsnoasociadas[$posicion]['draggable'] = false;
                    $posicion++;
                }
            }
        }
        return $arrayfuncsnoasociadas;
    }

    //metodo para listar los permisos
    public function listarPermisos($params) {
        $idsentidades = "";
        foreach ($params['dominios'] as $value) {
            if ($value->idconcepto == 0 || $value->idconcepto == 1 || $value->idconcepto == 2 || $value->idconcepto == 3 ||
                    $value->idconcepto == 4 || $value->idconcepto == 5 || $value->idconcepto == 6 || $value->idconcepto == 7 ||
                    // $value->idconcepto == 8 ||
                    $value->idconcepto == 9 || $value->idconcepto == 10) {
                $idsentidades.=$value->id . ",";
            }
        }
        $idsentidades.=$params['identidad'];
        $result = DatControlpermiso::listarPermisos($params, $idsentidades);
        return $result;
    }

    public function listarEstados($params) {
        $result = NomDatosnomenclador::listarEstados($params);
        return $result;
    }

    public function guardarPermisos($params) {
        foreach ($params['datos'] as $value) {
            if (!$value->idcontrolpermiso) {
                $controlpermiso = new DatControlpermiso();
                $controlpermiso->idfuncionalidad = $params['idfuncionalidad'];
                $controlpermiso->identidad = $value->identidad;
                $controlpermiso->eliminar = $value->eliminar;
                $controlpermiso->adicionar = $value->adicionar;
                $controlpermiso->modificar = $value->modificar;
                $controlpermiso->idestado = $params['idestado'];
                $controlpermiso->idejercicio = $params['idejercicio'];
                $controlpermiso->idusuario = $params['idusuario'];
                $controlpermiso->fecha = NULL;
                $controlpermiso->save();
            } else {
                $controlpermiso = Doctrine::getTable('DatControlpermiso')->findByDql("idcontrolpermiso = $value->idcontrolpermiso");
                $controlpermiso[0]->eliminar = $value->eliminar;
                $controlpermiso[0]->adicionar = $value->adicionar;
                $controlpermiso[0]->modificar = $value->modificar;
                $controlpermiso[0]->idusuario = $params['idusuario'];
                $controlpermiso[0]->fecha = NULL;
                $controlpermiso[0]->save();
            }
        }
    }

    public function asignarPermisoTodas($params) {
        foreach ($params['dominios'] as $key => $value) {
            if ($value->idconcepto != 8) {
                if ($value->id)
                    $identidad = $value->id;
                else
                    $identidad = $value;

                switch ($params['permiso']) {
                    case "adicionar":
                        DatControlpermiso::asignarPermisoAdicionar($params, $identidad);
                        break;
                    case "modificar":
                        DatControlpermiso::asignarPermisoModificar($params, $identidad);
                        break;
                    case "eliminar":
                        DatControlpermiso::asignarPermisoEliminar($params, $identidad);
                        break;
                }
            }
        }
        return 1;
    }

    public function quitarPermisoTodas($params) {
        foreach ($params['dominios'] as $key => $value) {
            if ($value->idconcepto != 8) {
                if ($value->id)
                    $identidad = $value->id;
                else
                    $identidad = $value;

                switch ($params['permiso']) {
                    case "adicionar":
                        DatControlpermiso::quitarPermisoAdicionar($params, $identidad);
                        break;
                    case "modificar":
                        DatControlpermiso::quitarPermisoModificar($params, $identidad);
                        break;
                    case "eliminar":
                        DatControlpermiso::quitarPermisoEliminar($params, $identidad);
                        break;
                }
            }
        }
        return 1;
    }

}
