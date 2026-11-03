<?php

class DatRetencionesAplicadasPorPersona extends BaseDatRetencionesAplicadasPorPersona
{

    public function setUp()
    {
        parent::setUp();
    }

    public static function obtenerPeriodosPagos($identidad, $idtipopago, $modopago, $cargarsinaprobar, $formato = 1)
    {
        if ($cargarsinaprobar == 2)
        {
            $sql = "select * from mod_nomina.dat_elaborarpagos	where identidad = ? and idtipopago = ? order by fechapago ASC ;";
        } else
        {
            $sql = "select * from mod_nomina.dat_elaborarpagos	where identidad = ? and idtipopago = ? order by fechapago ASC ;";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($identidad, $idtipopago));

        if ($formato == 1)
        {
            if (count($r) > 0)
            {
                foreach ($r as $i => &$v)
                {
                    $mesanyo = explode('-', $v['mesanyopago']);
                    if ($modopago == 1)
                    {
                        $fexplode = explode('/', $v['fechainicioperiodo']);
                        //$v['anyo'] = date('Y', strtotime($v['fechainicioperiodo']));print_r(date('Y', strtotime('"2016-08-16"')));die;
                        $v['anyo'] = $fexplode[2];
                    } else if ($modopago == 2)
                    {
                        $v['anyo'] = (count($mesanyo) > 0 ? $mesanyo[0] : '');
                    }
                    $v['periodopago'] = $v['fechainicioperiodo'] . ' al ' . $v['fechafinperiodo'];
                    $v['mes'] = (count($mesanyo) > 0 ? $mesanyo[1] : '');
                }
            }
        }
        return $r;
    }

}
