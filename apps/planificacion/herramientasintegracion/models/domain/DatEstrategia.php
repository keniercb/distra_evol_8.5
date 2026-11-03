<?php

class DatEstrategia extends BaseDatEstrategia
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatCriterioestrategia', array('local' => 'idestrategia', 'foreign' => 'idestrategia'));
    }

    public function getByid($idestrategia)
    {
        return Doctrine::getTable('DatEstrategia')->find($idestrategia);
    }

    public function getListadosByNomFactorXPares($params)
    {
        $idambitodofa = $params['idambitodofa'];
        $idestudiomatriz = $params['idestudiomatriz'];
        $factorclave1 = $params['factorclave1'];
        $factorclave2 = $params['factorclave2'];
        $analista = $params['analista'];
        $start = $params['start'];
        $limit = $params['limit'];

        $_query = Doctrine_Query::create();

        $_query->select('estrat.idestrategia,estrat.denominacion ,estrat.experto')
            ->from('DatEstrategia estrat')
            ->where('estrat.idambitodofa = ? and estrat.idfactorclave1 = ? and estrat.idfactorclave2 = ? OR estrat.idfactorclave1 = ? and estrat.idfactorclave2 = ? ', array($idambitodofa, $factorclave1, $factorclave2, $factorclave2, $factorclave1))
            ->addWhere('estrat.idmatrizdofa = ?', $idestudiomatriz);
        $_query = ($analista == 'false') ? $_query->addWhere('estrat.experto = ?',$analista ) : $_query;
        $_query->orderBy('estrat.idestrategia desc')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        $totalCount = count($_query->execute());
        $_query->limit($limit)
            ->offset($start);

        $result = $_query->execute();

        return array('cantidad_filas' => $totalCount, 'root' => $result);
    }

    public function salvarEstrategia($obj)
    {
        $obj->save();
        return $obj->idestrategia;
    }

    public function eliminarEstrategia($obj)
    {
        try {
            if ($obj) {
                $obj->delete();
                return array('success' => true);
            }
        } catch (Exception $e) {
            return array('success' => false);
        }
    }

    public function getEstrategias($arreglo)
    {
        $_query = Doctrine_Query::create();

        $_query->select('estrat.idestrategia as idestrategia, estrat.denominacion as denominacion,estrat.experto,estrat.orden')
            ->from('DatEstrategia estrat')
            ->where('estrat.idmatrizdofa = ?', $arreglo['idmatrizdofa']);
        $_query=($arreglo['orden'])?$_query->andwhere('estrat.orden is not null')->orderBy('estrat.orden'):$_query->orderBy('estrat.idestrategia ASC');
        $_query->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        $totalCount = count($_query->execute());
        $_query->limit($arreglo['start'])
            ->offset($arreglo['limit']);
        $result = $_query->execute();
        foreach ($result as $i => $value) {
            $result[$i]['tipo'] = $value['experto'] == 1 ? 'Experto' : 'Analista';
            $datos = DatCriterioestrategia::getByidFila($value['idestrategia']);
            foreach ($datos as $key) {
                $result[$i][$key['idcriterio']] = 'true';
            }
        }

        return array('cantidad_filas' => $totalCount, 'root' => $result);
    }

}
