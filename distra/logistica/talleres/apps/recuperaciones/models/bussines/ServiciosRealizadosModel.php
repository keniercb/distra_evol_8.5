<?php


class ServiciosRealizadosModel extends ZendExt_Model
{
    private $_servicioPlanificacionHelper, $_logisticaObject;

    public function __construct()
    {
        $this->_servicioPlanificacionHelper = ServiciosPlanificacionHelper::__init();
        $this->_logisticaObject = LogisticaObjectHelper::__init();
        parent::__construct();
    }

    public function getServiciosRealizados($params)
    {
       /* $result = $this->getServicios($params);
        foreach ($result[0] as $i => $b) {
            $serv = $this->_servicioPlanificacionHelper->obtenerActividadyNorma(
                2, array($b['idservicio']), array(), 0, 30, 0
            );
            $result[0][$i]['denominacion'] = $serv['datos'][0]['denominacion'];
        }
        return array('cantidad' => $result[2], 'datos' => $result[0], 'ordenes' => $result[1]['where']);*/  
        $estado = EstadoDocumentoModel::ESTADO_CERRADO;
            $conn = Zend_Registry::get('conexion');
            $sql = "select dot.idordentrabajo as idordentrabajo 
            from mod_logistica.dat_documento d 
            inner join mod_logtaller.dat_ordentrabajo dot on d.iddocumento = dot.idordentrabajo
            where d.estado = {$estado} and d.idestructuracomun = {$this->global->Estructura->idestructura}";
            //print_r($sql);die;
            /*if ($params['fechainicio']) {
                $dql->addWhere("ord.fechainicio >= ? ", array($params['fechainicio']));
            }
            if ($params['fechafin']) {
                $dql->addWhere("ord.fechafin <= ? ", array($params['fechafin']));
            }*/
            $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
          foreach($result as $doc){
             $arraydocumento[] = $doc['idordentrabajo'];
          }
        try{      
           $arraydocumento = "'{". implode($arraydocumento,',') ."}'";
          //print_r($arraydocumento);die;
          $start = ($params['start']) ? $params['start'] : 0;
          $limit = ($params['limit']) ? $params['limit'] : 30;
          $params['fechainicio'] = ($params['fechainicio']) ? $params['fechainicio'] : 'null';
          $params['fechafin'] = ($params['fechafin']) ? $params['fechafin'] : 'null';
    
          $sql = "select fn.servicio as denominacion ,fn.* from mod_logtaller.f_serviciosrealizados({$arraydocumento},{$params['fechainicio']},{$params['fechafin']},{$this->global->Estructura->idestructura},113) fn";
          
          return array(
              'success' => true,
              'cantidad' => $conn->execute($sql)->rowCount(),
              'ordenes' => $arraydocumento,
              'datos' => $conn->execute($sql . " limit {$params['limit']} offset {$params['start']}")->fetchAll(PDO::FETCH_ASSOC)
          );
        } catch(Exception $e){
            return array(
                  'success' => false,
                  'mensaje' => $e->getMessage()
              );
        }
    }

    public function getServicios($params)
    {
        $ordenService = new OrdenTrabajoTalleresService();
        $dql = $ordenService->devolverServiciosDeLasOrdenesCerradas('ts', $params);
        $dql->addSelect("ts.idservicio as idservicio, count(ts.idservicio) as cantidad")->groupBy("ts.idservicio")
            ->orderBy("ts.idservicio ASC");
        $result = $dql->fetchArray();
        $servicios = array();
        foreach ($result as $serv) {
            if ($serv['cantidad'] != 0) {
                $servicios[] = $serv;
            }
        }
        return array($servicios, $dql->getParams(), $dql->count());
    }


}
