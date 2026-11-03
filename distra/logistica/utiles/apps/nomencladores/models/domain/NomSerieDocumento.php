<?php

class NomSerieDocumento extends BaseNomSerieDocumento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatSerieDocumentoEntidad',
            array(
            'local' => 'idseriedocumento',
            'foreign' => 'idseriedocumento'
            )
        );
        if (class_exists('NomDocprim')) {
            $this->hasOne(
                'NomDocprim',
                array(
                'local' => 'iddoc',
                'foreign' => 'iddocumentos'
                )
            );
            $array[] = array(
                'cardinalidad' => 'many',
                'relation' => 'NomSeriedocumento',
                'properties' => array(
                    'foreign' => 'iddoc',
                    'local' => 'iddocumentos'
                )
            );
            $NomSeriedocumento = new NomDocprim();
            UtilesDoctrineModel::tryInyectRelactions($NomSeriedocumento, $array);
        }
        if (class_exists('DatDocfactura'))
            $this->hasMany(
                'DatDocfactura',
                array(
                'local' => 'idseriedocumento',
                'foreign' => 'idseriedocumento'
                )
            );
    }

    public function getSeries($obj)
    {
        $filtro = '';
        $arrFiltro[] = $obj['identidad'];
        $filtroArray[] = ' dcpe.idestructuracomun =?';
        $arrFiltro[] = 1;
        $filtroArray[] = ' n.estado = ?';
        if ($obj['iddoc']) {
            $arrFiltro[] = $obj['iddoc'];
            $filtroArray[] = ' n.iddoc = ? ';
        }
        if (!$obj['manual']) {
            $filtroArray[] = ' n.manual = 0 ';
        }
        if ($obj['manual'] == 2) {
            $filtroArray[] = ' n.manual = 1 ';
        }
        $query = Doctrine_Query::create()->select(
                'dcpe.idseriedocentidad as idseriedocentidad, '
                . 'n.idseriedocumento, '
                . 'n.denominacion,'
                . 'n.manual,'
                . 'n.iddoc, '
                . 'sop.idnomoperaciones'
            )->from('NomSeriedocumento n')
            ->innerJoin('n.DatSeriedocumentoEntidad dcpe')
            ->innerJoin('n.NomSerieoperacion sop');
        $filtro = implode(' AND ', $filtroArray);
        $query->where($filtro, $arrFiltro);
        return array(
            'datos' => $query->fetchArray(),
            'cantidad' => $query->count()
        );
    }

}
