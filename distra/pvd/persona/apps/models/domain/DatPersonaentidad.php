<?php

class DatPersonaentidad extends BaseDatPersonaentidad
{
    protected $_objEstructuraService;

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne(
            'NomProcedenciasocial', array('local' => 'idprocedenciasocial', 'foreign' => 'idprocedenciasocial')
        );
        //$this->hasOne('NomMotivobaja', array('local' => 'idmotivobaja', 'foreign' => 'idmotivobaja'));
        $this->hasMany('DatSituacionlaboral', array('local' => 'idpersonaentidad', 'foreign' => 'idpersonaentidad'));
        //$this->hasMany('DatReservacargo', array('local' => 'idpersonaentidad', 'foreign' => 'idpersonaentidad'));
		$this->hasMany('DatEstructura', array('local' => 'identidad', 'foreign' => 'idestructura'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idpersonaentidad
     *
     * @return Doctrine_Record
     */
    public function getById($idpersonaentidad)
    {
        if (is_array($idpersonaentidad) && count($idpersonaentidad) > 0) {
            return Doctrine_Query::create()->from('DatPersonaentidad')->whereIn('idpersonaentidad', $idpersonaentidad)
                ->execute();
        }

        return Doctrine::getTable('DatPersonaentidad')->find($idpersonaentidad);
    }
	
	public function getByIdPersona($idpersona, $identidad)
    {
		//print_r($idpersona);die;
        $query = Doctrine_Query::create()
            ->select("pe.idpersonaentidad")
            ->from('DatPersonaentidad pe')
            ->where(
                "pe.identidad = '$identidad'
                AND pe.idpersona = '$idpersona'
                AND (now() <= pe.fhasta OR pe.fhasta is null)"
            );
        return $query->execute()->toArray();
    }

    public function removeRecord($id)
    {
        if (count(Utiles::reflectArray($id)) > 0) {
            Doctrine_Query::create()->delete('DatPersonaentidad')
                ->whereIn('idpersonaentidad', Utiles::reflectArray($id))
                ->execute();
        }
    }

    public function getAllNumerosPublicos()
    {
        $sql = "select de.codigo as codigo from mod_estructuracomp.dat_estructura de
                where de.codigo <> '';";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }
}