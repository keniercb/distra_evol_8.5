<?php

class DatComentario extends BaseDatComentario
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipodocumento',
            array('local' => 'idtipodocumento', 'foreign' => 'idtipodocumento')
        );
        $this->hasOne(
            'NomTipocomentario', array('local' => 'idtipocomentario',
                                       'foreign' => 'idtipocomentario')
        );
    }

    public function Buscar($idcomentario)
    {
        $temp = $this->conn->getTable('DatComentario')->find($idcomentario);
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatComentario')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 0, $inicio = 20)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatComentario')->limit($limite = 0)->offset(
            $inicio = 20
        )->execute();
        return $result->toArray();
    }

    public function getTotal($idelemento)
    {
        $query = new Doctrine_Query();
        return $query->select('COUNT(c.idcomentario) as total')
            ->from('DatComentario c')->where('c.idelemento = ?', $idelemento)
            ->execute()->getFirst()->total;
    }

    public function listarComentarios($idelemento, $start = 0, $limit = 20,
        $parametros = null
    )
    {
        $query = new Doctrine_Query();
        $start = ($start) ? $start : 0;
        $limit = ($limit) ? $limit : 20;
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {

                if ($s != null) {
                    if ($p == 'asunto') {
                        $query->addWhere(
                            "upper(c.asunto)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'descripcion') {
                        $query->addWhere(
                            "upper(c.descripcion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'tcomentario') {
                        $query->addWhere(
                            "upper(tc.descripcion)  LIKE ? ",
                            ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'usuario') {
                        $query->addWhere(
                            "c.idusuario  LIKE ? ", ("%" . $s . "%")
                        );
                    } elseif ($p == 'fechacreado_condicion1'
                        || $p == 'fechacreado_condicion2'
                        || $p == 'fechacreado_condicion3'
                    ) {

                        $query->addWhere(
                            "c.fechacreado " . $s['condicion'] . " ? ",
                            $s['fecha']
                        );
                    }
                }
            }
        }


        $result = $query->select(
            "c.idcomentario,c.idtipodocumento,c.asunto,c.descripcion,c.fechacreado,c.idusuario,c.idelemento"
        )->from("DatComentario c")->addWhere('c.idelemento = ?', $idelemento)
            ->offset($start)->limit($limit)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function verificarIdPlanificacion($idplanificacion)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatComentario c')
            ->where('c.idtipodocumento =2  and idelemento =?', $idplanificacion)
            ->execute();
        return ($result->toArray()) ? true : false;
    }

}
