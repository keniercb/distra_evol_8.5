<?php

class MultientidadModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function cargarEntidades($node) {
        //****OJO VER CON RACIEL QUE EL SERVICIO NO FUNCIONA CUANDO SE LE PASA LA
        // SUBORDINACION 3 QUE ES LA DE PLANIFICACION, Y SOLO CUANDO NO SE PASA NADA...
        $estructuras = $this->integrator->metadatos->BuscarHijoPorSubordinacion(
                $node, 1
        ); //DEBERIA SER (0,3)
        //****OJO VER CON RACIEL QUE ESTE TAMPOCO FUNCIONA CUANDO SE LE PASA LA SUBORDINACION
        for ($i = 0; $i < count($estructuras); $i++) {
            $dat[$i]['id'] = $estructuras[$i]->idestructura;
            ; //$estructuras[$i]->idestructura;
            $dat[$i]['text'] = $estructuras[$i]->denominacion;
            $dat[$i]['draggable'] = false; //duda, para qu� es esto
            $hijos = $this->integrator->metadatos->BuscarHijoPorSubordinacion(
                    $estructuras[$i]->idestructura
            ); //900000098//100000003//$estructuras[$i]->idestructura
            $padref = $hijos[0]->NomFilaestruc['hijo']['idpadre'];

            if ($padref == $estructuras[$i]->idestructura) {
                $dat[$i]['leaf'] = false;
            } else {
                $dat[$i]['leaf'] = true;
            }
        }

        return $dat;
    }

    public function getArrayEspecialidades($arrayIdentidad, $porEntidadAssoc = 0
    ) {
        $datosEntidad = array();
        if ($arrayIdentidad [0] != null) {

            $datosEntidad = $this->integrator->metadatos->ObtenerDatosEstructuraPorArrayID(
                    $arrayIdentidad
            );
        }
        $arrayIdespecialidades = array();
        $arrayParaleloEntesp = array();
        if (is_array($datosEntidad)) {
            if ($porEntidadAssoc == '1') {
                foreach ($datosEntidad as $valorEntidad) {
                    $arrayIdespecialidades['identidad'
                            . $valorEntidad->idestructura] = $valorEntidad->idespecialidad;
                }
            } else {
                if ($porEntidadAssoc == '3') {
                    foreach ($datosEntidad as $valorEntidad) {
                        if ($valorEntidad) {
                            $arrayIdespecialidades[] = $valorEntidad[0]->idespecialidad;
                            $arrayParaleloEntesp['identidad'][] = $valorEntidad[0]->idestructura;
                            $arrayParaleloEntesp['idespecialidad'][] = $valorEntidad[0]->idespecialidad;
                        }
                    }
                    return $arrayParaleloEntesp;
                } else {
                    foreach ($datosEntidad as $valorEntidad) {
                        $arrayIdespecialidades[] = $valorEntidad[0]->idespecialidad;
                    }
                }
            }
        }
        return $arrayIdespecialidades;
    }

}
