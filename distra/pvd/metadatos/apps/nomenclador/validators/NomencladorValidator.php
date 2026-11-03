<?php

/**
 * Class NomencladorValidator
 */
class NomencladorValidator extends ZendExt_Model
{
    //--------------------- Funcion global ----------------------------------------
    /**
     * @return bool
     */
    public function ValidarCamposMostrar()
    {
        if ($_POST ['limit'] == '' || $_POST ['start'] == '') {
            $_POST ['limit'] = 100000;
            $_POST ['start'] = 0;

            return true;
        }

        return true;
    }

    /**
     *
     */
    function validarGestionNomencladores()
    {
    }

    //--------------------- Nomenclador de Salario ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarDesactivarSalario()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'salario' && ($accion == 'eliminar' || $accion == 'desactivar')) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idsalario = $data[0];
            if (NomSalario::verificarUsoSalario($idsalario)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarSalario()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'salario' && $accion == 'insertar') {
            $nomSalario = new NomSalario();
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $salario = $valores->salario;
            $idgrupocomplejidad = $valores->idgrupocomplejidad;
            if ($nomSalario->existeSalario($salario, $idgrupocomplejidad)) {
                return false;
            } else {
                return true;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarSalario()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'salario' && $accion == 'modificar') {
            $nomSalario = new NomSalario();
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $idsalario = $data[0];
            $salario = $valores->salario;
            $idgrupocomplejidad = $valores->idgrupocomplejidad;
            if ($nomSalario->existeSalario($salario, $idgrupocomplejidad, true, $idsalario)) {
                return false;
            }
        }

        return true;
    }

    //--------------------- Nomenclador de Grupo de complejidad ----------------------------------------
    /**
     * @return bool
     */
    public function validarInsertarGrupoComplejidad()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'grupo' && $accion == 'insertar') {
            $nomGC = new NomGrupocomplejidad();
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $denominacion = $valores->denominacion;
            $denominacion = Util::fixTitle($denominacion);
            if ($nomGC->existeDenominacion($denominacion)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarGrupoComplejidad()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'grupo' && $accion == 'modificar') {
            $nomGC = new NomGrupocomplejidad();
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            if ($den != $denant) {
                if ($nomGC->existeDenominacion($den)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarEliminarDesactivarGrupoComplejidad()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'grupo' && ($accion == 'eliminar' || $accion == 'desactivar')) {
            $obj = new NomGrupocomplejidad();
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idgrupo = $data[0];
            if ($obj->verificarUsoGrupoComplejidad($idgrupo)) {
                return false;
            }
        }

        return true;
    }

    //--------------------- Nomenclador de Preparacion ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarDesactivarPreparacion()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'preparacion' && ($accion == 'eliminar' || $accion == 'desactivar')) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idpreparacion = $data[0];
            if (NomPreparacion::verificarUsoPreparacion($idpreparacion)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarPreparacion()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'preparacion' && $accion == 'insertar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $denominacion = $valores->denominacion;
            $denominacion = Util::fixTitle($denominacion);
            $clase = new NomPreparacion();
            if ($clase->existeDenominacion($denominacion)) {
                return false;
            } else {
                return true;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarPreparacion()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'preparacion' && $accion == 'modificar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            $clase = new NomPreparacion();
            if ($den != $denant) {
                if ($clase->existeDenominacion($den)) {
                    return false;
                } else {
                    return true;
                }
            }

            return true;
        }

        return true;
    }

    //--------------------- Nomenclador de Tipo de Medio ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarDesactivarTipoMedio()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'tipomedio' && ($accion == 'eliminar' || $accion == 'desactivar')) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idTipoMedio = $data[0];
            if (NomTipomedio::verificarUsoTipoMedio($idTipoMedio)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarTipoMedio()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'tipomedio' && $accion == 'insertar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $denominacion = $valores->denominacion;
            $denominacion = Util::fixTitle($denominacion);
            $clase = new NomTipomedio();
            if ($clase->existeDenominacion($denominacion)) {
                return false;
            } else {
                return true;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarTipoMedio()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'tipomedio' && $accion == 'modificar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            $clase = new NomTipomedio();
            if ($den != $denant) {
                if ($clase->existeDenominacion($den)) {
                    return false;
                }
            }
        }

        return true;
    }

    //--------------------- Nomenclador de Categoria Ocupacional ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarDesactivarCategoriaOcupacional()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'categoria' && ($accion == 'eliminar' || $accion == 'desactivar')) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idcategocup = $data[0];
            if (NomCategocup::verificarUsoCategoria($idcategocup)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarCategoriaOcupacional()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'categoria' && $accion == 'insertar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $denominacion = $valores->denominacion;
            $denominacion = Util::fixTitle($denominacion);
            $clase = new NomCategocup();
            if ($clase->existeDenominacion($denominacion)) {
                return false;
            } else {
                return true;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarCategoriaOcupacional()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'categoria' && $accion == 'modificar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            $clase = new NomCategocup();
            if ($den != $denant) {
                if ($clase->existeDenominacion($den)) {
                    return false;
                }
            }
        }

        return true;
    }

    //--------------------- Nomenclador de Grado ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarDesactivarGrado()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'grado' && ($accion == 'eliminar' || $accion == 'desactivar')) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idgrado = $data[0];
            if (NomGrado::verificarUsoGrado($idgrado)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarGrado()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'grado' && $accion == 'insertar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $denominacion = $valores->denominacion;
            $marina = UtilModel::getRealValue($valores->marina);
            $marina = (is_numeric($marina)) ? $marina : 0;
            $denominacion = Util::fixTitle($denominacion);
            $clase = new NomGrado();
            if ($clase->existeDenominacion($denominacion, $marina)) {
                return false;
            } else {
                return true;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarGrado()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'grado' && $accion == 'modificar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            $marina = UtilModel::getRealValue($valores->marina);
            $marina = (is_numeric($marina)) ? $marina : 0;
            $clase = new NomGrado();
            if ($den != $denant) {
                if ($clase->existeDenominacion($den, $marina)) {
                    return false;
                }
            }
        }

        return true;
    }

    //--------------------- Nomenclador de Tipo de Subordinacion ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarDesactivarTipoSubordinacion()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'subordinacion' && ($accion == 'eliminar' || $accion == 'desactivar')) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idsubordinacion = $data[0];
            if (NomSubordinacion::verificarUsoSubordinacion($idsubordinacion)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarTipoSubordinacion()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'subordinacion' && $accion == 'insertar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $denominacion = $valores->denominacion;
            $denominacion = Util::fixTitle($denominacion);
            $clase = new NomSubordinacion();
            if ($clase->existeDenominacion($denominacion)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarTipoSubordinacion()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'subordinacion' && $accion == 'modificar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            $clase = new NomSubordinacion();
            if ($den != $denant) {
                if ($clase->existeDenominacion($den)) {
                    return false;
                }
            }
        }

        return true;
    }

    //--------------------- Nomenclador de Tipo de Subordinacion ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarIcono()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'icono' && ($accion == 'eliminar')) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idicono = $data[0];
            if (NomIcono::verificarUsoIcono($idicono)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarIcono()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'icono' && $accion == 'insertar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $denominacion = $valores->denominacion;
            $denominacion = Util::fixTitle($denominacion);
            $clase = new NomIcono();
            if ($clase->existeDenominacion($denominacion)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarIcono()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'icono' && $accion == 'modificar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            $clase = new NomIcono();
            if ($den != $denant) {
                if ($clase->existeDenominacion($den)) {
                    return false;
                }
            }
        }

        return true;
    }

    //--------------------- Nomenclador de Cargo ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarDesactivarCargo()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'cargo' && ($accion == 'eliminar' || $accion == 'desactivar')) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idCargo = $data[0];
            if (NomCargo::verificarUsoCargo($idCargo)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarCargo()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'cargo' && $accion == 'insertar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $denominacion = $valores->denominacion;
            $denominacion = Util::fixTitle($denominacion);
            $clase = new NomCargo();
            if ($clase->existeDenominacion($denominacion)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarCargo()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if ($clase == 'cargo' && $accion == 'modificar') {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            $clase = new NomCargo();
            if ($den != $denant) {
                if ($clase->existeDenominacion($den)) {
                    return false;
                }
            }
        }

        return true;
    }

    //--------------------- Nomenclador de Organo ----------------------------------------
    /**
     * @return bool
     */
    public function validarEliminarDesactivarOrgano()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if (($clase == 'organo' || $clase == 'organoi' || $clase == 'agrupacion' || $clase == 'agrupacioni') &&
            ($accion == 'eliminar' || $accion == 'desactivar')
        ) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $idorgano = $data[0];
            $idconcepto = $data[1];
            if (NomOrgano::verificarUsoOrgano($idorgano, $idconcepto)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarInsertarOrgano()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if (($clase == 'organo' || $clase == 'organoi' || $clase == 'agrupacion' || $clase == 'agrupacioni') &&
            $accion == 'insertar'
        ) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $idConcepto = $data[1];
            $denominacion = $valores->denominacion;
            $denominacion = Util::fixTitle($denominacion);
            $clase = new NomOrgano();
            if ($clase->existeDenominacion($denominacion, $idConcepto)) {
                return false;
            } else {
                return true;
            }
        }

        return true;
    }

    /**
     * @return bool
     */
    public function validarModificarOrgano()
    {
        $clase = $_POST ['clase'];
        $accion = $_POST ['accion'];
        if (($clase == 'organo' || $clase == 'organoi' || $clase == 'agrupacion' || $clase == 'agrupacioni') &&
            $accion == 'modificar'
        ) {
            $data = json_decode(stripslashes($_POST ['parametros']));
            $valores = $data[2];
            $idConcepto = $data[1];
            $den = Util::fixTitle($valores->denominacion);
            $denant = Util::fixTitle($valores->denanterior);
            $clase = new NomOrgano();
            if ($den != $denant) {
                if ($clase->existeDenominacion($den, $idConcepto)) {
                    return false;
                }
            }
        }

        return true;
    }
    //******************************* END **************************************//
}