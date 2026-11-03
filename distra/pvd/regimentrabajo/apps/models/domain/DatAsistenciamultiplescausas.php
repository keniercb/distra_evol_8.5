<?php
class DatAsistenciamultiplescausas extends BaseDatAsistenciamultiplescausas
 { 
   public function setUp() 
    {   parent::setUp(); 
    }   
	
	public function getById($id)
    {
        return Doctrine::getTable('DatAsistenciamultiplescausas')->find($id);
    }

    public function getmultiplescausasbypersona($idpersona, $fecharegistro)
    {
        $query = Doctrine_Query::create()
            ->select("mc.*, to_char(mc.fechaentrada, 'YYYY-MM-DD HH24:MI:SS') as fechaentrada_format, to_char(mc.fechasalida, 'YYYY-MM-DD HH24:MI:SS') as fechasalida_format")
            ->from('DatAsistenciamultiplescausas mc')
            ->where("mc.idpersona = '$idpersona'")
            ->orderBy("mc.fechaentrada")
            ->addWhere("mc.fecharegistro = cast('" . $fecharegistro . "' as date)");
        return $query->execute()->toArray();
    }

    public function getUltimaHora($idpersona, $fecharegistro)
    {
        $query = Doctrine_Query::create()
            ->select('MAX(mc.horasalida) as ultimahora')
            ->from('DatAsistenciamultiplescausas mc')
            ->where("mc.idpersona = '$idpersona'")
            ->addWhere("mc.fecharegistro = cast('" . $fecharegistro . "' as date)");
        return $query->execute()->toArray();
    }

    public function sumaHorasCausales($idpersona, $fecharegistro)
    {
        $query = Doctrine_Query::create()
            ->select('SUM(mc.horas) as suma')
            ->select('SUM(CAST(mc.horas AS TIME)) AS suma')
            ->from('DatAsistenciamultiplescausas mc')
            ->where("mc.idpersona = '$idpersona'")
            ->addWhere("mc.fecharegistro = cast('" . $fecharegistro . "' as date)");
        $r = $query->execute()->toArray();
        return $r[0]['suma'];
    }

    public function Existe($idpersona,$idcausa,$fecharegistro,$horaentrada,$horasalida)
    {
        $query = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatAsistenciamultiplescausas m');
        if (!empty($idpersona)) {
            $query->addWhere("m.idpersona = " . $idpersona);
        }
        if (!empty($idcausa)) {
            $query->addWhere("m.idcausa = " . $idcausa);
        }
        if (!empty($fecharegistro)) {
            $query->addWhere("m.fecharegistro = cast('" . $fecharegistro . "' as date)");
        }
        if (!empty($horaentrada)) {
            $query->addWhere("m.horaentrada = cast('" . $horaentrada . "' as time)");
        }
        if (!empty($horasalida)) {
            $query->addWhere("m.horasalida = cast('" . $horasalida . "' as time)");
        }//print_r($query->getSqlQuery());die;
        return $query->execute()->toArray();
    }

    public function deleteAsistenciaByPerson($idasistupd)
    {
        $sql = "DELETE FROM 
                  mod_regimentrabajo.dat_asistenciamultiplescausas 
                WHERE 
                  idasistencia IN (" . implode(',', $idasistupd) . ")
                ;";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    static public function getAsistenciasMultiplesCausas($idasistencia)
    {
        $query = Doctrine_Query::create()
            ->select("mc.*, to_char(mc.fechaentrada, 'YYYY-MM-DD HH24:MI:SS') as fechaentrada_format, to_char(mc.fechasalida, 'YYYY-MM-DD HH24:MI:SS') as fechasalida_format")
            ->from('DatAsistenciamultiplescausas mc')
            ->where("mc.idasistencia = '$idasistencia'");
        return $query->execute()->toArray();
    }

    public function getAsistenciasMultiplesCausasByIdsAsist($idasistencia)
    {
        $sql = "Select * FROM 
                  mod_regimentrabajo.dat_asistenciamultiplescausas 
                WHERE 
                  idasistencia IN (" . implode(',', $idasistencia) . ")
                ;";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    static public function sumHorasMultiplesCausasByIdsAsist($idasistencia, $idasistenciamultiplescausas = null)
    {
        $sqlId = '';

        if (is_numeric($idasistenciamultiplescausas)) {
            $sqlId = "and idasistenciamultiplescausas != $idasistenciamultiplescausas";
        }
        
        $sql = "SELECT 
                  sum(horas::time)
                FROM 
                  mod_regimentrabajo.dat_asistenciamultiplescausas where idasistencia = $idasistencia 
                  $sqlId;";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function getMultiplesCausas($idasistenciamultiplescausas)
    {
        $query = Doctrine_Query::create()
            ->select('mc.*')
            ->from('DatAsistenciamultiplescausas mc')
            ->where("mc.idasistenciamultiplescausas = '$idasistenciamultiplescausas'");
        return $query->execute()->toArray();
    }

    public function SumHorasByCausa($idasistencia)
    {
        $sql = "SELECT 
                sum(mc.horas::time)
                FROM mod_regimentrabajo.dat_asistenciamultiplescausas mc
                inner join mod_regimentrabajo.nom_causa nc on nc.idcausa = mc.idcausa
                where mc.idasistencia = $idasistencia and nc.afectasalario = 1;";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    static public function extisteHoraEntraSalida($idasistencia, $fechaEntrada, $fechaSalida, $idMultiCausa)
    {
        $where = '';

        if ($idMultiCausa) {
            $where .= "and idasistenciamultiplescausas != $idMultiCausa";
        }

        $sql = "SELECT *
                FROM mod_regimentrabajo.dat_asistenciamultiplescausas
                where idasistencia = $idasistencia 
                and (fechaentrada = '$fechaEntrada' or fechasalida = '$fechaSalida')
                $where
                ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    static public function extisteSolapamiento($idasistencia, $fechaEntrada, $fechaSalida, $idMultiCausa)
    {
        $where = '';

        if ($idMultiCausa) {
            $where .= "and idasistenciamultiplescausas != $idMultiCausa";
        }

        $sql = "SELECT *
                FROM mod_regimentrabajo.dat_asistenciamultiplescausas
                where idasistencia = $idasistencia 
                and fechaentrada >= '$fechaEntrada' 
                and fechasalida <= '$fechaSalida'
                $where
                ";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

}
?>
