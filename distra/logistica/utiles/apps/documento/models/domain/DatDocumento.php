<?php

class DatDocumento extends BaseDatDocumento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatBloqueo', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatDocumentoprim', array('local' => 'iddoc', 'foreign' => 'iddoc'));
        $this->hasMany('DatDocumentoCliente', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatDocumentotransporte', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatDocumentoPadre', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatMovimientos', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatPedido', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatDocumentocl', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatDocumentoImagen', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

    public function devolverUltimoNumeroDoc($iddoc = null, $idestructuracomun = null, $idejercicio = null, $campo = 'nrodoc', $params = array())
    {
        $query = new Doctrine_Query();
        $query->select("MAX(d.{$campo}) as numero")->from('DatDocumento d');
        if ($iddoc) {
            $iddoc = !is_array($iddoc) ? array($iddoc) : $iddoc;
            $query->andWhereIn('d.iddoc ', $iddoc);
        }
        if ($idestructuracomun) {
            $idestructuracomun = !is_array($idestructuracomun) ? array($idestructuracomun) : $idestructuracomun;
            $query->andWhereIn('d.idestructuracomun ', $idestructuracomun);
        }
        /*if ($this->contains('idespecialidad')) {
            if (isset($params['idespecialidad']) && !empty($params['idespecialidad'])) {
                $query->addWhere('d.idespecialidad = ?', array($params['idespecialidad']));
            }
        }*/
        if ($idejercicio) {
            $query->addWhere('d.idejercicio = ?', array($idejercicio));
        }
        //echo $query->getSqlQuery();die;
        $res = $query->fetchArray();
        //print_r($res);
        return $res[0]['numero'] ? $res[0]['numero'] : 0;
    }

    public function getEstadoByIdDocuments($iddocumento = null, $idestructuracomun = null)
    {
        $query = new Doctrine_Query();
        if ($iddocumento) {
            $query->addWhere('d.iddocumento = ?', array($iddocumento));
        }
        if ($idestructuracomun) {
            $query->addWhere('d.idestructuracomun = ?', array($idestructuracomun));
        }

        $query->select('*')->from('DatDocumento d');
        $res = $query->fetchArray();

        return $res[0];
    }

    public function GetCronologia($iddocumento = false)
    {
        $sql = "SELECT MAX(cronologia) as cronologia FROM DatDocumento d";
        if ($iddocumento) {
            $sql .= " WHERE d.iddocumento = {$iddocumento}";
        }
        $result = LogisticaDoctrineHelper::__init()->query($sql)->toArray();
        $cronologia = $result[0]['cronologia'];
        return ($result[0]) ? ($iddocumento ? $cronologia : $cronologia + 1) : 1;
    }

    public function getIdOperacionIdDocumento($iddocumento)
    {
        $sql = "SELECT d.idoperacion as idoperacion FROM DatDocumento d where d.iddocumento = {$iddocumento}";
        $result = LogisticaDoctrineHelper::__init()->query($sql);
        return $result[0]['idoperacion'];
    }

}
