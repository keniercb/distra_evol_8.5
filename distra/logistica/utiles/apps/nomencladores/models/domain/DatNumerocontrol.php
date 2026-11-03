<?php

class DatNumerocontrol extends BaseDatNumerocontrol
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatSerieDocumentoEntidad',
            array(
            'local' => 'idseriedocentidad',
            'foreign' => 'idseriedocentidad'
            )
        );
        $this->hasOne(
            'DatRangonumerocontrol',
            array(
            'local' => 'idrango',
            'foreign' => 'idrango'
            )
        );
        if (class_exists('DatDocfactura')) {
            $this->hasOne(
                'DatDocfactura',
                array(
                'local' => 'idnumerocontrol',
                'foreign' => 'idnumerocontrol'
                )
            );
        }
    }

    public function conformarFiltro($array)
    {
        $arrFiltro = array();
        $filtroArray = array();
        $filtro = '';
        if ($array['nros']) {
            $filtroArray[] = " dnc.nrocontrol in ({$array['nros']})";
        }

        if ($array['rangos']) {
            foreach ($array['rangos'] as $rango) {
                $arrFiltro[] = $rango['inicio'];
                $arrFiltro[] = $rango['fin'];
                $filtroArray[] = " dnc.nrocontrol between ? AND ?";
            }
        }

        if ($array['comprobante']) {
            $filtroArray[] = " dd.idcomprobante is not null ";
        }

        if ($array['activo'] || $array['activo'] === 0) {
            $arrFiltro[] = $array['activo'];
            $filtroArray[] = " dr.activo = ? ";
        }

        if ($array['idestructuracomun']) {
            $arrFiltro[] = $array['idestructuracomun'];
            $filtroArray[] = " dr.idestructuracomun = ? ";
        }

        if ($array['asignado'] || $array['asignado'] === 0) {

            if ($array['iddocumento']) {
                $arrFiltro[] = $array['asignado'];
                $arrFiltro[] = $array['iddocumento'];
                $filtroArray[] = " (dnc.asignado = ? or df.idfactura = ?)";
            } else {
                $arrFiltro[] = $array['asignado'];
                $filtroArray[] = " dnc.asignado = ? ";
            }
        }

        if ($array['anulado'] || $array['anulado'] === 0) {
            $arrFiltro[] = $array['anulado'];
            $filtroArray[] = " dnc.anulado = ? ";
        }

        if ($array['idseriedocentidad']) {
            $arrFiltro[] = $array['idseriedocentidad'];
            $filtroArray[] = " dnc.idseriedocentidad = ? ";
        }

        if ($array['excluir']) {
            //$arrFiltro[] = $array['excluir'] ;
            $filtroArray[] = " dnc.nrocontrol not in ({$array['excluir']}) ";
        }

        if ($array['idnumerocontrol']) {
            $filtroArray[] = " dnc.idnumerocontrol in ({$array['idnumerocontrol']}) ";
        }
        if ($array['nrocontrol']) {
            $arrFiltro[] = '%' . $array['nrocontrol'] . '%';
            $filtroArray[] = " dnc.nrocontrol ilike ?  ";
        }

        if ($array['nrodocumento']) {
            $arrFiltro[] = $array['nrodocumento'] . '%';
            $filtroArray[] = " dnc.nrodocumento ilike ?  ";
        }

        return array('filtro' => implode(' AND ', $filtroArray), 'valores' => $arrFiltro);
    }

    /*
     * @autor Lester A. Gonzalez
     * @descripcion Metodo para ejecutar una consulta pero en pdo
     * */

    public function ejecutarPdo($query, $valores, $fetch)
    {
        $conn = Zend_Registry::get('conexion');
        $res = $conn->execute($query->getSqlQuery(), $valores);

        if (PDO::FETCH_BOTH == $fetch[0]) {
            $res2 = $conn->execute($query->getSqlQuery(), $valores);
            $result['nros'] = $res->fetchAll(PDO::FETCH_COLUMN, $fetch[1]);
            $result['datos'] = $res2->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } else
            return $res->fetchAll($fetch[0], $fetch[1]);
    }

    /*
     * @autor Lester A. Gonzalez
     * @descripcion Metodo para devolver los de numeros de control
     * @param arreglo
     * @return array(nrocontrol)
     * */

    public function devolverNumcontrol($arrayNumeros)
    {
        $query = new Doctrine_Query();
        $res = $this->conformarFiltro($arrayNumeros);
        $query->select('DISTINCT dnc.nrocontrol, df.idfactura ')->from('DatNumerocontrol dnc')
            ->leftJoin('dnc.DatDocfactura df')
            ->leftJoin('df.DatDocumento dd')
            ->innerJoin('dnc.DatRangonumerocontrol dr')
            ->where($res['filtro'], $res['valores'])
            ->orderBy('dnc.nrocontrol', 'ASC');
        if ($arrayNumeros['addselect'])
            $query->addSelect($arrayNumeros['addselect']);
        return ($arrayNumeros['pdo']) ? $this->ejecutarPdo($query, $res['valores'], $arrayNumeros['pdo']) : $query->fetchArray();
    }

    /*
     * @autor Lester A. Gonzalez
     * @descripcion Metodo para anular los numeros de control
     * @param arreglo
     * @return array(nrocontrol)
     * */

    public function anularNumeros($arrayNumeros)
    {
        $conn = Zend_Registry::get('conexion');
        $res = $this->conformarFiltro($arrayNumeros);

        $sql = "UPDATE mod_logfacturacion.dat_numerocontrol
				SET anulado = 1 ,
                fechaanulado = '{$arrayNumeros['fecha']}'
                    from (
                            select dnc.idnumerocontrol as id  from mod_logfacturacion.dat_numerocontrol dnc
                            inner join mod_logfacturacion.dat_rangonumerocontrol dr on dr.idrango = dnc.idrango
                            where {$res['filtro']}
                    ) t
				WHERE idnumerocontrol in (t.id)";
        return $conn->exec($sql, $res['valores']);
    }

    public function getJoinFacturaNumeroControl(Doctrine_Query $query, $alias, $aliasnc = 'nc')
    {
        $query->leftJoin("{$alias}.DatNumerocontrol {$aliasnc}");
        $query->addSelect("{$aliasnc}.nrocontrol as nrocontrol,{$aliasnc}.asignado as asignado"
        . "$aliasnc}.anulado as anulado");
        return $query;
    }

    public function devolverIdfacturas($arrayNumeros)
    {
        $query = new Doctrine_Query();
        $res = $this->conformarFiltro($arrayNumeros);
        $query->select('DISTINCT df.idfactura ')->from('DatDocFactura df ')
            ->innerJoin('df.DatNumerocontrol dnc')
            ->leftJoin('df.DatDocumento dd')
            ->innerJoin('dnc.DatRangonumerocontrol dr')
            ->where($res['filtro'], $res['valores']);
        return ($arrayNumeros['pdo']) ? $this->ejecutarPdo($query, $res['valores'], 
            $arrayNumeros['pdo']) : $query->fetchArray();
    }

}
