<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatArcModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function Insertar(DatArc $datArc)
    {
        $datArc->save();
    }

    public function Actualizar(DatArc $datArc)
    {
        $datArc->save();
    }

    public function Eliminar($datArc)
    {
        $datArc->delete();
    }

    public function ObtenerAreas(
        $idusuariosession, $offset, $limit, $denominacion, $fechainicio,
        $fechafin, $arrayautoresact, $arrayinvolact, $tfcar
    ) {
        $arrayareass = DatArc::ObtenerAreas(
            $offset, $limit, $denominacion, $fechainicio, $fechafin,
            $arrayautoresact, $arrayinvolact, $tfcar
        );
        $arrayareas = $arrayareass[1];
        if (isset($arrayareas[0]['idarc'])) {
            foreach ($arrayareas as $key => $area) {
                $leaf = true;
                $tienearchijas = DatArc::ObtenerAreasHijas(
                    $area['idarc']
                );
                if (isset($tienearchijas[0])) {
                    foreach ($tienearchijas as $hija) {
                        $idarchija = $hija['idarc'];
                        foreach ($arrayareas as $arc) {
                            if ($arc['idarc'] == $idarchija) {
                                $leaf = false;
                            }
                        }
                    }
                }
                $parent = null;
                if ($area['idarcp'] != $arc['idarc']) {
                    foreach ($arrayareas as $arc) {
                        if ($area['idarcp'] == $arc['idarc']
                            && $area['idarc'] != $arc['idarc']
                        ) {
                            $parent = $arc['idarc'];
                        }
                    }
                }
                $superior = 0;
                $modificar = 1;
                $eliminar = 1;
                $subordinado = 1;
                if ($area['autor'] != $idusuariosession) {
                    $superior = 1;
                    $permisomodificacion
                        = $this->pIntegrator->configuracionpdo->TienePermisoParaSobre(
                        $idusuariosession, $area['autor'], $certificado,
                        $iddominio
                    );
                    if ($permisomodificacion) {
                        $modificar = $permisomodificacion[2];
                        $eliminar = $permisomodificacion[3];
                        $subordinado = $permisomodificacion[4];
                    } else {
                        $modificar = 0;
                        $eliminar = 0;
                        $subordinado = 0;
                    }
                }
                $arrayareas[$key]['autor']
                    = $this->integrator->seguridad->nombreUsuario(
                    $area['autor']
                );
                $arrayareas[$key]['idautor'] = $area['autor'];
                $arrayareas[$key]['_is_leaf'] = $leaf;
                $arrayareas[$key]['_parent'] = $parent;
                $arrayareas[$key]['superior'] = $superior;
                $arrayareas[$key]['subordinado'] = $subordinado;
                $arrayareas[$key]['mod'] = $modificar;
                $arrayareas[$key]['del'] = $eliminar;
            }
            $arrayareass[1] = $arrayareas;
        }
        return $arrayareass;
    }

}

