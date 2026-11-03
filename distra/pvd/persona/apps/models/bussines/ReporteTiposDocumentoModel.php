<?php

/**
 * Class ReporteTiposDocumentoModel
 */
class ReporteTiposDocumentoModel extends ZendExt_Model
{
    function __construct()
    {
        
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }
    
    public function getTiposDocumentoIdentidad()
    {
        try {
            $sql = "SELECT idtipodocidentidad, denominacion FROM mod_persona.nom_tipodocidentidad
                        WHERE fdesde <= now() AND (fhasta > now() OR fhasta IS NULL);";
            $query = Doctrine_Manager::getInstance();
            return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDatosTiposDocIdentificacion($idsTiposDocIdent, $idestructura)
    {
        try {
            $query = Doctrine_Manager::getInstance();
            
            if (!empty($idestructura)) {
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            
                if (count($cargos) > 0) {
                    foreach ($cargos as $h => $carg) {
                        $idcargos[$h] = $carg['idcargo'];
                    }
                    $stringIdsCargos = $this->arrayToString($idcargos);
                    
                    $sql = "SELECT tdi.idtipodocidentidad, tdi.denominacion as tipodocumento, (SELECT COUNT(di.iddocidentidad)
                                            FROM mod_persona.dat_docidentidad AS di
                                            INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = di.idpersona AND dp.feliminado is null)
                                            INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersona = dp.idpersona)
                                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                            WHERE di.idtipodocidentidad = tdi.idtipodocidentidad AND di.fdesde <= now() AND (di.fhasta > now() OR di.fhasta IS NULL) 
                                                    AND sl.idcargo IN ($stringIdsCargos) AND sl.principal = 1 AND sl.estado = 0
                                    ) AS cantidad, (SELECT COUNT(di.iddocidentidad)
                                            FROM mod_persona.dat_docidentidad AS di
                                            INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = di.idpersona AND dp.feliminado is null)
                                            INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersona = dp.idpersona)
                                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                            WHERE di.idtipodocidentidad = tdi.idtipodocidentidad AND di.principal = 1 AND di.fdesde <= now() AND (di.fhasta > now() OR di.fhasta IS NULL)
                                                    AND sl.idcargo IN ($stringIdsCargos) AND sl.principal = 1 AND sl.estado = 0
                                    ) AS cantidadprincipal
                            FROM mod_persona.nom_tipodocidentidad AS tdi
                            WHERE tdi.fdesde <= now() AND (tdi.fhasta > now() OR tdi.fhasta IS NULL)";

                    if (!empty($idsTiposDocIdent)) {
                        $sql .= " AND tdi.idtipodocidentidad IN ($idsTiposDocIdent)";
                    }

                    $sql .= " ORDER BY tdi.idtipodocidentidad;";                

                    return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                    
                } else {
                    
                    $sql = "SELECT tdi.idtipodocidentidad, tdi.denominacion as tipodocumento, 0 AS cantidad, 0 AS cantidadprincipal
                            FROM mod_persona.nom_tipodocidentidad AS tdi
                            WHERE tdi.fdesde <= now() AND (tdi.fhasta > now() OR tdi.fhasta IS NULL)";

                    if (!empty($idsTiposDocIdent)) {
                        $sql .= " AND tdi.idtipodocidentidad IN ($idsTiposDocIdent)";
                    }

                    $sql .= " ORDER BY tdi.idtipodocidentidad;";                

                    return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                    
                }
            } else {
                $sql = "SELECT tdi.idtipodocidentidad, tdi.denominacion as tipodocumento, (SELECT COUNT(di.iddocidentidad)
                                        FROM mod_persona.dat_docidentidad AS di
                                        INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = di.idpersona AND dp.feliminado is null)
                                        WHERE di.idtipodocidentidad = tdi.idtipodocidentidad AND di.fdesde <= now() AND (di.fhasta > now() OR di.fhasta IS NULL)
                                ) AS cantidad, (SELECT COUNT(di.iddocidentidad)
                                        FROM mod_persona.dat_docidentidad AS di
                                        INNER JOIN mod_persona.dat_persona AS dp ON (dp.idpersona = di.idpersona AND dp.feliminado is null)
                                        WHERE di.idtipodocidentidad = tdi.idtipodocidentidad AND di.principal = 1 AND di.fdesde <= now() AND (di.fhasta > now() OR di.fhasta IS NULL)
                                ) AS cantidadprincipal
                        FROM mod_persona.nom_tipodocidentidad AS tdi
                        WHERE tdi.fdesde <= now() AND (tdi.fhasta > now() OR tdi.fhasta IS NULL)";

                if (!empty($idsTiposDocIdent)) {
                    $sql .= " AND tdi.idtipodocidentidad IN ($idsTiposDocIdent)";
                }

                $sql .= " ORDER BY tdi.idtipodocidentidad;";                
                
                return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            }            
            
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function getPersonasPorTipoDeDoc($idestructura, $idTipoDocIdent, $idcolumna, $limit = null, $start = null)
    {
        try {
            $query = Doctrine_Manager::getInstance();
            
            if (!empty($idestructura)) {
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            
                foreach ($cargos as $h => $carg) {
                    $idcargos[$h] = $carg['idcargo'];
                }
                $stringIdsCargos = $this->arrayToString($idcargos);
                
                $sql = "SELECT dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel, di.numero as docident
                        FROM mod_persona.dat_persona AS dp
                        INNER JOIN mod_persona.dat_docidentidad AS di ON (di.idpersona = dp.idpersona)
                        INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersona = dp.idpersona)
                        INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                        WHERE dp.feliminado is null AND di.fdesde <= now() AND (di.fhasta > now() OR di.fhasta IS NULL)
                                AND sl.idcargo IN ($stringIdsCargos) AND sl.principal = 1 AND sl.estado = 0
                                AND di.idtipodocidentidad = $idTipoDocIdent";
                
                if ($idcolumna == 2) {
                    $sql .= "  AND di.principal = 1";
                }
                
                if ($limit) {
                    $sql .= " limit {$limit}
                            offset {$start};";
                }
                
                return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);                    
                
            } else {                
                $sql = "SELECT dp.idpersona, dp.nombre, dp.snombre, dp.papel, dp.sapel, di.numero as docident
                        FROM mod_persona.dat_persona AS dp
                        INNER JOIN mod_persona.dat_docidentidad AS di ON (di.idpersona = dp.idpersona)
                        WHERE dp.feliminado is null AND di.fdesde <= now() AND (di.fhasta > now() OR di.fhasta IS NULL) 
                                AND di.idtipodocidentidad = $idTipoDocIdent";
                
                if ($idcolumna == 2) {
                    $sql .= "  AND di.principal = 1";
                }
                
                if ($limit) {
                    $sql .= " limit {$limit}
                            offset {$start};";
                }              
                
                return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            }            
            
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function getCantPersonasPorTipoDeDoc($idestructura, $idTipoDocIdent, $idcolumna)
    {
        try {
            $query = Doctrine_Manager::getInstance();
            
            if (!empty($idestructura)) {
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            
                foreach ($cargos as $h => $carg) {
                    $idcargos[$h] = $carg['idcargo'];
                }
                $stringIdsCargos = $this->arrayToString($idcargos);
                
                $sql = "SELECT COUNT(dp.idpersona) AS cantidad
                        FROM mod_persona.dat_persona AS dp
                        INNER JOIN mod_persona.dat_docidentidad AS di ON (di.idpersona = dp.idpersona)
                        INNER JOIN mod_persona.dat_personaentidad AS dpe ON (dpe.idpersona = dp.idpersona)
                        INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                        WHERE dp.feliminado is null AND di.fdesde <= now() AND (di.fhasta > now() OR di.fhasta IS NULL)
                                AND sl.idcargo IN ($stringIdsCargos) AND sl.principal = 1 AND sl.estado = 0
                                AND di.idtipodocidentidad = $idTipoDocIdent";
                
                if ($idcolumna == 2) {
                    $sql .= "  AND di.principal = 1";
                }
                
                return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);                    
                
            } else {                
                $sql = "SELECT COUNT(dp.idpersona) AS cantidad
                        FROM mod_persona.dat_persona AS dp
                        INNER JOIN mod_persona.dat_docidentidad AS di ON (di.idpersona = dp.idpersona)
                        WHERE dp.feliminado is null AND di.fdesde <= now() AND (di.fhasta > now() OR di.fhasta IS NULL) 
                                AND di.idtipodocidentidad = $idTipoDocIdent";
                
                if ($idcolumna == 2) {
                    $sql .= "  AND di.principal = 1";
                }              
                
                return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            }            
            
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    private function arrayToString($array)
    {
        $string = '';
        foreach ($array as $key => $value) {
            if ($key == 0) {
                $string .= $value;
            } else {
                $string .= ',' . $value;
            }
        }
        return $string;
    }
    
}