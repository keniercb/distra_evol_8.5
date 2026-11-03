<?php

/*@utor:Pedro Enrique Rojas
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
        $idactividad = $this->post['idactividad'];
        /* Buscar actividades hijas decendientes */
        $modeloActEnt = new DatActividadentidad();
        $actividadesDescendientes = NomActividad::BuscarDecendiciaFamiliar(
            $idactividad
        );


        if (sizeof($actividadesDescendientes) > 0) {
            foreach ($actividadesDescendientes as $valor) {
                if (DatActividadentidad::estaActAsociada(
                    $valor['idactividad']
                )
                ) {
                    return false;
                }
            }
        } else {
            $modeloActEnt = new DatActividadentidad();
            return (DatActividadentidad::estaActAsociada($idactividad)) ? false
                : true;
        }
        return true;
    }

    public function validarExistenciaCodigoActividad()
    {
        $codigo = $this->post['codigo'];
        $idpadre = $this->post['idpadre'];
        $idactividad = $this->post['idactividad'];
        /**Se captura el idorigen por si esta duplicando la actividad*/
        $idactorigen = $this->post['idactorigen'];

        $global = ZendExt_GlobalConcept::getInstance();
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $especialidades = $this->nomenclador->selectParam(
            'nom_especialidad', array('codespecialidad'), 0, 0,
            "idespecialidad = " . $global->Estructura->idespecialidad
        );
        $codigoespecialidad = $especialidades[0]['codespecialidad'];


        if ($idactividad != '') {
            /*Modificar*/
            $actividad = Doctrine::getTable('NomActividad')->find($idactividad);
            if ($actividad->idpadre == $idactividad) {
                /*Modificar actividad del grupo de la actividad(1er nivel)*/
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
            /*Duplicar*/
            $actividadOrigen = Doctrine::getTable('NomActividad')->find(
                $idactorigen
            );
            if ($actividadOrigen->idpadre == $idactorigen) {
                /*Duplicar activida del grupo de la actividad (1er nivel)*/
                $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                $actividadPadre = Doctrine::getTable('NomActividad')->find(
                    $actividadOrigen->idpadre
                );
                $codigo = $actividadPadre->codigo . "" . $codigo;
            }
        } elseif ($idactividad == '') {
            /*Adicionar */
            if ($idpadre == '') {
                /*Adicionar sub actividad*/
                $codigo = $codigoespecialidad . "" . $codigo;
            } else {
                /*Adicionar actividad del grupo de la actividad(1er nivel)*/
                $actividadpadre = Doctrine::getTable('NomActividad')->find(
                    $idpadre
                );
                $codigo = $actividadpadre->codigo . "" . $codigo;
            }
        }
        return (NomActividad::existeCodigo($codigo) == false);
    }


    /*public function validarActividadAsociadaEntidadPorRegla() {
        $identidad = $this->post['identidad'];
        $idactividad = $this->post['idactividad'];
        /*temporal se envia el identidad vacio por problemas en las validaiones de la IU*
        if($identidad == '')
            return false;
         return DatActividadentidad::existeActividadAsociadaAEntidadAutomatica($identidad,$idactividad)
         == null;        
    }*/


}

