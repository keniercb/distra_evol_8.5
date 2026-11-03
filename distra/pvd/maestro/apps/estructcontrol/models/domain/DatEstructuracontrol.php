<?php
class DatEstructuracontrol extends BaseDatEstructuracontrol
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatControlador', array('local'=>'idestructuracontrol','foreign'=>'idestructuracontrol'));
        $this->hasMany(
            'DatDominioestructuracontrol',
            array('local'=>'idestructuracontrol', 'foreign'=>'idestructuracontrol')
        );
    }

    public function getById($idestructuracontrol)
    {
        return Doctrine::getTable('DatEstructuracontrol')->find($idestructuracontrol);
    }

    public function getEstructurascontrolAll($estructuras, $idestructuraentrada)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*, ec.idestructura, nd.denominacion')
            ->from('DatEstructuracontrol c')
            ->innerJoin('c.DatDominioestructuracontrol ec')
            ->innerJoin('ec.NomDominio nd');
        if (count($estructuras) > 0) {
            $queryObj->whereIn("c.identidad", $estructuras);
        }
        if (isset($idestructuraentrada)) {
            $queryObj->orWhere("ec.idestructura = '$idestructuraentrada'");
        }
        return $queryObj->fetchArray();
    }

    public function existeDenom($denominacion, $idestructura)
    {
        $denominacion = strtoupper($denominacion);
        $queryObj = Doctrine_Query::create()
            ->select('m.denominacion')
            ->from('DatEstructuracontrol m')
            ->innerJoin('m.DatDominioestructuracontrol ec')
            ->where("UPPER(TRIM(m.denominacion)) = UPPER(TRIM('$denominacion')) and ec.idestructura = '$idestructura'");
        return $queryObj->fetchArray();
    }

    public function GetPersonas($idcargo,$idpersona)
    {
        $sql = "SELECT m.idpersona,(CASE WHEN m.snombre is not null THEN m.nombre||' '|| m.snombre||' '|| m.papel||' '||  m.sapel
                    	ELSE m.nombre||' '|| m.papel||' '||  m.sapel END) AS nombreapellidos,
                      m9.identidad, m10.ueb, m10.idarea,m10.idcargo,drt.idregimentrabajo,drt.idgrupodescanso,drt.idturnotrabajo,drt.idregimentrabajop,ident.numero AS numid
                FROM mod_persona.dat_persona m 
                LEFT JOIN mod_persona.dat_docidentidad AS ident ON (m.idpersona = ident.idpersona AND ident.principal = 1 AND (ident.fhasta > now() OR ident.fhasta IS NULL))
                LEFT JOIN mod_persona.dat_personaentidad m9 ON m.idpersona = m9.idpersona AND ((m9.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m9.fhasta OR m9.fhasta is null))) 
                LEFT JOIN mod_persona.dat_situacionlaboral m10 ON m9.idpersonaentidad = m10.idpersonaentidad AND ((m10.fdesde <= LOCALTIMESTAMP(0) AND (LOCALTIMESTAMP(0) <= m10.fhasta OR m10.fhasta is null)))
                LEFT JOIN mod_personaext.dat_regimentrabajo drt ON m.idpersona = drt.idpersona and drt.idcargo = m10.idcargo and drt.actual = 1 and drt.fdesde <= LOCALTIMESTAMP(0) and (drt.fhasta is null or drt.fhasta >= LOCALTIMESTAMP(0))";
        if(count($idcargo) > 0 && count($idpersona) > 0) {
            $sql .= " WHERE m10.idcargo in (".implode(',',$idcargo).") and m.idpersona in (".implode(',',$idpersona).")";
        } else {
            if(count($idcargo) > 0) {
                $sql .= " WHERE m10.idcargo in (".implode(',',$idcargo).")";
            } else {
                if(count($idpersona) > 0) {
                    $sql .= " WHERE m.idpersona in (".implode(',',$idpersona).")";
                }
            }
        }
        $sql .= " AND m.feliminado is null";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }
}