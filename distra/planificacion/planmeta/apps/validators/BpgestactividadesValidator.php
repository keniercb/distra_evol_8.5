<?php

/* @utor:Pedro Enrique Rojas
 */
class BpgestactividadesValidator
{

    public $post = array();

    public function BpgestactividadesValidator()
    {
        $this->post = $_POST;
    }

    public function validarActividadAsociadaEntidad()
    {
        return true;
    }

    public function validarExistenciaCodigoActividad()
    {


        $codigo = $this->post['codigo'];
        $idpadre = $this->post['idpadre'];
        $idactividad = $this->post['idactividad'];

        $idactorigen = $this->post['idactorigen'];


        $global = ZendExt_GlobalConcept::getInstance();
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $especialidades = $this->nomenclador->selectParam(
            'nom_especialidad', array('codespecialidad'), 0, 0,
            "idespecialidad = " . $global->Estructura->idespecialidad
        );
        $codigoespecialidad = $especialidades[0]['codespecialidad'];


        if ($idactividad != '' && $idactorigen == null) {


            $actividad = Doctrine::getTable('NomActividad')->find($idactividad);
            if ($actividad->idpadre . ' ' == $idactividad . ' ') {

                $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                $actividadpadre = Doctrine::getTable('NomActividad')->find(
                    $idpadre
                );
                $codigo = $actividadpadre->codigo . "" . $codigo;
            }
            return (NomActividad::existeCodigoAlModificar($idactividad, $codigo)
                == false);
        } elseif ($idactorigen != '') {


            $actividadOrigen = Doctrine::getTable('NomActividad')->find(
                $idactorigen
            );
            if ($actividadOrigen->idpadre . " " == $idactorigen . " ") {

                $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                $actividadPadre = Doctrine::getTable('NomActividad')->find(
                    $actividadOrigen->idpadre
                );
                $codigo = $actividadPadre->codigo . "" . $codigo;
            }
        } elseif ($idactividad == '') {


            if ($idpadre == '') {

                $codigo = $codigoespecialidad . "" . $codigo;
            } else {

                $actividadpadre = Doctrine::getTable('NomActividad')->find(
                    $idpadre
                );
                $codigo = $actividadpadre->codigo . "" . $codigo;
            }
        }
        return (NomActividad::existeCodigo($codigo) == false);
    }

    public function validarActividadAprobada()
    {
        $arrayActividades = json_decode(
            stripslashes($this->post['actividades'])
        );
        if ($this->post['estado'] == '0' || $this->post['esrector'] == 'true') {
            return true;
        }
        if (is_array($arrayActividades)) {
            foreach ($arrayActividades as $valorActividad) {
                $objactividad = Doctrine::getTable('NomActividad')->find(
                    $valorActividad->idactividad
                );
                if ($objactividad->idaprobacion < 3) {
                    return false;
                }
            }
        }
        return true;
    }

    public function validarActividadNormada()
    {
        $arrayActividades = json_decode(
            stripslashes($this->post['actividades'])
        );
        $idaprobacion = $this->post['idaprobacion'];
        $ultimonivel = $this->post['ultimonivel'];
        if ($idaprobacion == '1') {
            return true;
        }
        if (is_array($arrayActividades)) {
            foreach ($arrayActividades as $valorAct) {
                if ($valorAct->nivel == $ultimonivel) {
                    $objactividad = Doctrine::getTable('NomActividad')->find(
                        $valorAct->idactividad
                    );
                    if ($objactividad->normada == '0') {
                        return false;
                    }
                } else {
                    //buscar que todos sus hijos del ultimo nivel esten normados
                    if (NomActividad::todaDecendenciaUltimoNivNormada(
                        array($valorAct, $ultimonivel)
                    ) == false
                    ) {
                        return true;
                    }
                }
            }
        }
        return true;
    }

}

