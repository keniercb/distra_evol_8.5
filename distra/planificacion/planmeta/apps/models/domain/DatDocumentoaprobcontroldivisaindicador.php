<?php

class DatDocumentoaprobcontroldivisaindicador
    extends BaseDatDocumentoaprobcontroldivisaindicador
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne(
            'DatDocumentoaprobacion', array('local'   => 'iddocumentoaprobacion',
                                            'foreign' => 'iddocumentoaprobacion')
        );
        $this->hasOne(
            'DatControldivisaindicador',
            array('local'   => 'idcontroldivisaindicador',
                  'foreign' => 'idcontroldivisaindicador')
        );
    }

    public function listarAprobaciones()
    {

        $conn = Doctrine_Manager::connection();
        $query
            = "   SELECT DISTINCT d.identidad AS identidad
FROM  mod_planificacion.dat_ajusteexistenciaod d

LEFT JOIN  mod_planificacion.nom_indicador n ON d.idindicador = n.idindicador
LEFT JOIN  mod_planificacion.dat_indicadorcentrobalance d4 ON n.idindicador = d4.idindicador
";
        $res = $conn->execute($query);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);

        return $data->data;
    }

}
