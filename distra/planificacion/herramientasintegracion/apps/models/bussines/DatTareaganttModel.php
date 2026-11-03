<?php

class DatTareaganttModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function adicionarTarea($objeto, $action)
    {
        try {
            if ($objeto['porcientocumplimiento'] == '0 %') {
                $objeto['porcientocumplimiento'] = 0;
            }
            $objDatTareagantt = new DatTareagantt();
            $objTareagantt = $action == 'adicionar' ? $objDatTareagantt : $objDatTareagantt->getByid($objeto['idtareagantt']);
            $objTareagantt->idestudiogantt = $objeto['idestudiogantt'];
            $objTareagantt->idpadre = isset($objeto['idpadre']) ? $objeto['idpadre'] : null;
            $objTareagantt->denominacion = $objeto['denominacion'];
            $objTareagantt->descripcion = isset($objeto['descripcion']) ? $objeto['descripcion'] : null;
            $objTareagantt->duraciontarea = $objeto['duraciontarea'];
            $objTareagantt->porcientocumplimiento = $objeto['porcientocumplimiento'];
            $objTareagantt->fechaini = $objeto['fechaini'];
            $objTareagantt->fechafin = $objeto['fechafin'];
            $objTareagantt->idunidadtiempo = $objeto['idunidadtiempo'];
            $objTareagantt->save();
            return $objTareagantt->toArray();
        } catch (Exception $ex) {
            return array("cod" => 3, "mensaje" => $ex->getMessage());
        }
    }

    public function obtenerTarea($idestudiogantt)
    {
        $objDatTareagantt = new DatTareagantt();
        $data = $objDatTareagantt->obtenerTarea($idestudiogantt);
        $cumplidas = 0;
        $total = count($data);
        foreach ($data as $c => $var) {
//            $data[$c]['denominacion'] = $this->partirCadena($var['denominacion'], 20);
            if ($var['porcientocumplimiento'] == 100) {
                $cumplidas++;
            }
        }
        return array('root' => $data, 'cantidad_filas' => $total, 'porciento' => round(($cumplidas / $total) * 100, 2));
    }


    public function partirCadena($cadena, $longitud)
    {
        $cadena1 = $cadena;
        if (strlen($cadena1) > $longitud) {
            $cadena = wordwrap($cadena1, $longitud, "\n", false);
        }
        return $cadena;
    }

    public function obtenerTareaPredecesora($idestudiogantt, $idtareagantt)
    {
        $objDatTareagantt = new DatTareagantt();
        $addWhere = "tg.idestudiogantt = ($idestudiogantt)";
        if ($idtareagantt != NULL) {
            $addWhere .= " AND tg.idtareagantt <> ($idtareagantt)";
        }
        $data = $objDatTareagantt->obtenerTareaPredecesora($addWhere);
        return $data;
    }

    public function eliminarTarea($objeto)
    {
        try {
            $objDatTareagantt = new DatTareagantt();
            $objTareagantt = $objDatTareagantt->getByid($objeto['idtareagantt']);
            if ($objTareagantt != null) {
                $idpadre = $objTareagantt->idtareagantt;
                $fechainicio = $objTareagantt->fechafin;
                $arrayTareasHijas = $objDatTareagantt->obtenerTareasHijas($idpadre);
                if (count($arrayTareasHijas) > 0) {
                    return (array('codMsg' => 3, 'mensaje' => 'La acción seleccionada no se puede eliminar debido a que est&aacute; en uso.'));
                } else {
                    $data = $objTareagantt->delete();
                }
                return array("cod" => 1, "data" => $data);
            }
        } catch (Exception $ex) {
            return array("cod" => 3, "mensaje" => $ex->getMessage());
        }
    }

    public function buscarTarea($objeto)
    {
        $objDatTareagantt = new DatTareagantt();
        $idestudiogantt = $objeto['idestudiogantt'];
        $denominacion = $objeto['denominacion'];
        $fechaini = $objeto['fechaini'];
        $fechafin = $objeto['fechafin'];
        $addWhere = "tg.idestudiogantt = ($idestudiogantt)";
        if ($denominacion != "") {
            $addWhere .= " AND LOWER(tg.denominacion) LIKE LOWER ('%$denominacion%')";
        }
        if ($objeto['fechaini'] != "") {
            $addWhere .= " AND tg.fechaini = ('$fechaini')";
        }
        if ($fechafin != "") {
            $addWhere .= " AND tg.fechafin = ('$fechafin')";
        }
        $data = $objDatTareagantt->buscarTarea($addWhere);
        return array('root' => $data, 'cantidad_filas' => count($data));
    }

    public function getDatosReporte($params)
    {
        $data = array();
        $tareas = $this->obtenerTarea($params['idestudiogantt']);

        $data[0]->tipo = 'estandar';
        $data[0]->columnas = array('Acción','Duración','Porcentaje de cumplimiento',
            'Fecha inicio','Fecha fin', 'Predecesora');
        $data[0]->referencia = array('denominacion','duraciontarea','porcientocumplimiento',
            'fechaini','fechafin', 'predecesora');
        $data[0]->unidad = array('','unidadtiempo','&%', '','','');
        $data[0]->encabezado = 'Listado de acciones';
        $data[0]->datos = $tareas['root'];

        $data[1]->tipo = 'diagrama';
        $data[1]->encabezado = 'Diagrama de Gantt';
        $data[1]->chartid = 'report_gantt';


        return array('data'=> $data, 'tareas' => $tareas);
    }

}
