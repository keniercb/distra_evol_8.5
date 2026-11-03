<?php

class DatServicioModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listar($params)
    {
        /*$query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();
        $data->data = $query
            ->from("DatServicio ser")
            ->addWhere('ser.idaplicacioncartatec = ?', $params['idaplicacioncartatec'])
            ->offset($params['start'])
            ->limit($params['limit'])
            ->execute()->toArray(true);

        $arrayTotal = $querytotal
            ->select('COUNT(ser.idaplicacioncartatec) as total')
            ->addWhere('ser.idaplicacioncartatec = ?', $params['idaplicacioncartatec'])
            ->execute()->toArray(true);
        $data->total = $arrayTotal[0]['total'];*/
        $data->data = DatServicio::listarServicioDadoIdAplicAartaTecn($params);
        $result = DatServicio::listarServicioDadoIdAplicAartaTecnTotal($params);
        $data->total = $result[0]['total'];

        foreach ($data->data as $indice => $valor) {
            $act = Doctrine::getTable('NomActividad')->find($valor['idactividad']);
            $data->data[$indice]['codigo'] = $act->codigo;
            $data->data[$indice]['denominacion'] = $act->denominacion;
            $data->data[$indice]['descripcion'] = $act->descripcion;
        }
        return $data;
    }


    public function adicionarServicio($params)
    {
        foreach ($params['idactividades'] as $idactividad) {
            if ($idactividad != null) {
                $objServ = new DatServicio();
                $objServ->idaplicacioncartatec
                    = $params['idaplicacioncartatec'];
                $objServ->idactividad = $idactividad;
                $objServ->gasto = '0';
                $objServ->save();
            }
        }
        return '24';
    }


    public function modificarServicios($params)
    {
        foreach ($params['servicios'] as $valorServicio) {
            $objServicio = DatServicio::buscarServicio(
                $params['idaplicacioncartatec'], $valorServicio->idactividad
            )
                ->getFirst();
            $objServicio->gasto = floatval($valorServicio->gasto);
            $objServicio->save();
        }
        return '24';
    }

    public function eliminarServicios($params)
    {
        $queryElim = Doctrine_Query::create();
        $queryElim->delete("DatServicio")
            ->from("DatServicio ser")
            ->whereIn("ser.idactividad", $params['servicios'])
            ->addWhere(
                'ser.idaplicacioncartatec = ?', $params['idaplicacioncartatec']
            )
            ->execute();
        return '24';
    }


}


