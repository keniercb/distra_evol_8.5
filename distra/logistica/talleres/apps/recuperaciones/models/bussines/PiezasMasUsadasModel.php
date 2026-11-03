<?php

class PiezasMasUsadasModel extends ZendExt_Model
{
    private $_ordenTrabajoService;

    public function __construct()
    {
        parent::__construct();
      //  $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
    }

    public function getPiezasMasUsadas($params)
    {
        /*$piezas = array();
        $resultado = array();
        if ($params['fechafin']) {
            $params['fechaentrega'] = $params['fechafin'];
            unset($params['fechafin']);
        }
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        unset($params['start']);
        unset($params['limit']);
        $ordenes = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, false);
        foreach ($ordenes['datos'] as $field) {
            $result[] = $field['idordentrabajo'];
        }
        $params['start'] = $start;
        $params['limit'] = $limit;
        $arrPiezas = $this->_ordenTrabajoService->devolverMaterialesOrden($result);
        foreach ($arrPiezas ['datos'] as $pieza) {
            $piezas[] = $pieza;
        }
        $data = $this->contarPiezas($piezas);
        foreach ($data as $index => $row) {
            $resultado[$index]['cantidad'] = $row['cantidad'];
            $resultado[$index]['codigo'] = $row['pieza']['codigo'];
            $resultado[$index]['denominacion'] = $row['pieza']['descripcionmarcamodelo'];
            $resultado[$index]['marca'] = $row['pieza']['marca'];
            $resultado[$index]['modelo'] = $row['pieza']['modelo'];
            $resultado[$index]['umedida'] = $row['pieza']['nomunidamedida'];
        }
        return array('cantidad' => count($resultado), 'datos' => $resultado);*/
        try{
          $start = ($params['start']) ? $params['start'] : 0;
          $limit = ($params['limit']) ? $params['limit'] : 30;
          $params['fechainicio'] = ($params['fechainicio']) ? $params['fechainicio'] : 'null';
          $params['fechafin'] = ($params['fechafin']) ? $params['fechafin'] : 'null';
          $sql = "select fn.pieza as denominacion ,fn.um as umedida,fn.* from mod_logtaller.f_piezasmasusadas({$params['fechainicio']},{$params['fechafin']},{$this->global->Estructura->idestructura},113) fn";
          //print_r($sql);die;
          $conn = Zend_Registry::get('conexion');
          return array(
              'cantidad' => $conn->execute($sql)->rowCount(),
              'datos' => $conn->execute($sql . " limit {$params['limit']} offset {$params['start']}")->fetchAll(PDO::FETCH_ASSOC)
          );
        } catch(Exception $e){
            return array(
                  'success' => false,
                  'mensaje' => $e->getMessage()
              );
        }
    }

    public function contarPiezas($array)
    {
        $result = array();
        $max = count($array);
        for ($i = 0; $i < $max; $i++) {
            $codigoInicial = $array[$i]['codigo'];
            $aux = $array[$i]['cantidad'];
            if ($i != $max - 1) {
                for ($j = $i + 1; $j < $max; $j++) {
                    $codigoAuxiliar = $array[$j]['codigo'];
                    if ($codigoInicial == $codigoAuxiliar) {
                        $aux += $array[$j]['cantidad'];
                        unset($array[$j]);
                    }
                }
            }
            if ($aux > 0) {
                $result[$i]['cantidad'] = (int)$aux;
                $result[$i]['pieza'] = $array[$i];
            }
        }
        rsort($result);
        return $result;
    }


}