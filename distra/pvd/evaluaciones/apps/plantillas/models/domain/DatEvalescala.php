<?php

class DatEvalescala extends BaseDatEvalescala {


    public function setUp() {
        parent::setUp();
        $this->hasOne('DatEvalindicadoresevaluar', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasOne('DatEvalescalavalorescualitativos', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasOne('DatEvalescalarangonumerico', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasOne('DatEvalescalavaloresimagen', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasOne('DatEvalmodelo', array('local' => 'idescala', 'foreign' => 'idescala'));
        //$this->hasOne('DatEvaldefprocesoevaluativo', array('local' => 'idescala', 'foreign' => 'idescala'));
    }

//Busca una escala dado su id.
    public function Buscar($idescala) {

        $query = new Doctrine_Query ( );
        $temp = $query->from('DatEvalescala e')->where("e.idescala = ?", $idescala)->execute()->toArray();
        return $temp;
    }

//Devuelve todas las escalas
    public function GetTodos() {

        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalescala')->execute();
        return $result->toArray();
    }

//Devuelve la cantidad total de escalas
    public function GetCantTotal() {
        try {
            $query = new Doctrine_Query ( );
            $result = $query->select('COUNT(idescala)')->from('DatEvalescala');
            $arr = $result->fetchArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetCantTotalByDenom($filtro) {
        try {
            $query = new Doctrine_Query ( );
            $result = $query->select('COUNT(idescala)')->from('DatEvalescala')
                    ->where("denom ILIKE '%$filtro%'")
                    ->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

//Devuelve las escalas dentro de un rango determinado
    public function GetPorLimite($limite = 15, $inicio = 0) {
        $query =  Doctrine_Query::create()
                ->from('DatEvalescala')
                ->orderBy('idescala DESC')
                ->limit($limite)
                ->offset($inicio);
        return $query->fetchArray();
    }

    public function getEscalasByDenom($filtro, $limite = 15, $inicio = 0) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalescala')
                ->where("denom ILIKE '%$filtro%'")
                ->orderBy('idescala DESC')
                ->limit($limite)
                ->offset($inicio)
                ->execute();
        return $result->toArray();
    }

//Devuelve todas las escalas para un tipo de escala determinado
    public function getEscalasPorTipo($tipoescla, $limit = 15, $start = 0) {
        try {
            $query = new Doctrine_Query ( );
            $result = $query->select('e.idescala, e.denom, e.descripcion,e.desde,e.hasta, e.tipoescala')
                    ->from('DatEvalescala e')
                    ->where('e.tipoescala = ?', $tipoescla)
                    ->limit($limit)
                    ->offset($start)
                    ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getCantidadEscalasPorTipo($tipoescla) {
        try {
            $query = new Doctrine_Query ( );
            $result = $query->select('count(e.idescala) as cantidad')
                    ->from('DatEvalescala e')
                    ->where('e.tipoescala = ?', $tipoescla)
                    ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Devuelve los valores dado un idescala. Esta funcion es mas eficiente.
     * @author Javier Rodriguez Lopez
     * @param numeric $idescala Identificador de la escala
     * @return array Valores de la escala
     */
    public function getValuesByIdEscala($idescala) {
        if(empty($idescala)){
            return array();
        }else{
            $query = Doctrine_Manager::getInstance();
            $sql = "SELECT e.idescala, e.tipoescala,
                (CASE
                  WHEN e.tipoescala = 0 THEN vn.idvaloresnumericos
                  WHEN e.tipoescala = 1 THEN vc.idvalorescualitativos
                END) as idvalor,
                (CASE
                  WHEN e.tipoescala = 0 THEN vn.denom::varchar
                  WHEN e.tipoescala = 1 THEN vc.denom
                END) as denom,
                (CASE
                  WHEN e.tipoescala = 0 THEN vn.denom
                  WHEN e.tipoescala = 1 THEN evc.peso
                END) as valor,
                 (CASE
                  WHEN e.tipoescala = 0 THEN '#000000'
                  WHEN e.tipoescala = 1 THEN evc.color
                END) as color
                FROM mod_evaluaciones.dat_evalescala e
                --Valores numericos
                LEFT JOIN mod_evaluaciones.dat_evalescalarangonumerico ern ON (e.idescala = ern.idescala AND e.tipoescala = 0)
                LEFT JOIN mod_evaluaciones.nom_evalvaloresnumericos vn ON (vn.idescalarangonumerico = ern.idescalarangonumerico)
                --Valores vualitivos
                LEFT JOIN mod_evaluaciones.dat_evalescalavalorescualitativos evc ON (e.idescala = evc.idescala AND e.tipoescala = 1)
                LEFT JOIN mod_evaluaciones.nom_evalvalorescualitativos vc ON (vc.idvalorescualitativos = evc.idvalorescualitativos)
                WHERE e.idescala = {$idescala};";
            return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        }
    }

//Devuelve los valores de una escala segun idescala (NO USAR)
    public function GetValoresPorEscala($idescala) {
        try {
            $result = array();
            $query = Doctrine_Manager::getInstance();
            $sql = "SELECT dee.tipoescala
				FROM mod_evaluaciones.dat_evalescala dee
				WHERE dee.idescala = '$idescala'";
            $tipoEscala = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $tipoEscala = $tipoEscala[0]['tipoescala'];

            if ($tipoEscala == 0) { //Escalas de rango n�merico
                $DatEvalescalarangonumerico = new DatEvalescalarangonumerico();
                $result = $DatEvalescalarangonumerico->getValoresEscala($idescala);
                foreach ($result as &$r) {
                    $r['tipoescala'] = $tipoEscala;
                }
            } else if ($tipoEscala == 1) { //Escalas cualitativas
                $sql = "SELECT nvc.idvalorescualitativos as idescala, nvc.denom, nvc.descripcion, dee.tipoescala
					FROM
					  mod_evaluaciones.dat_evalescala dee
					  INNER JOIN mod_evaluaciones.dat_evalescalavalorescualitativos devc ON (dee.idescala = devc.idescala)
					  INNER JOIN mod_evaluaciones.nom_evalvalorescualitativos nvc ON (devc.idvalorescualitativos = nvc.idvalorescualitativos)
					WHERE
					  dee.idescala = '$idescala'";

                $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            } else if ($tipoEscala == 2) { //Escalas de imagen
                $sql = "SELECT nvi.idvaloresimagenes, devi.idescala, devi.orden as peso, devi.idevalescalavaloreimagene as idevalescalavaloreimagene, nvi.denom, nvi.descripcion, nvi.extension, dee.tipoescala
					FROM
					  mod_evaluaciones.dat_evalescala dee
					  INNER JOIN mod_evaluaciones.dat_evalescalavaloresimagen devi ON (dee.idescala = devi.idescala)
					  INNER JOIN mod_evaluaciones.nom_evalvaloresimagenes nvi ON (devi.idvaloresimagenes = nvi.idvaloresimagenes)
					WHERE
					  dee.idescala = '$idescala'
                                        ORDER BY
                                          devi.orden ASC";

                $varAux = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                foreach ($varAux as $imagen) {
                    $result[] = array('idevalescalavaloreimagene' => $imagen['idevalescalavaloreimagene'], 'idvaloresimagenes' => $imagen['idvaloresimagenes'], 'idescala' => $imagen['idescala'], 'denom' => '../../../plantillas/nomvalimgs/' . $imagen['idvaloresimagenes'] . $imagen['extension'], 'descripcion' => $imagen['descripcion'], 'tipoescala' => $imagen['tipoescala'], 'peso' => $imagen['peso']);
                }
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetEscala($id) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalescala e')->where('e.idescala=?', array($id))->execute();
        return $result->toArray();
    }

    public function existeEscala($denom) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalescala')
                ->where('denom = ?', $denom)
                ->execute();
        return $result->toArray();
    }

    //Devuelve los valores de una escala segun idescala
    public function GetResultByEscalaValor($idescala, $idvalor) {
        try {
            $result = array();
            $query = Doctrine_Manager::getInstance();
            $sql = "SELECT * --dee.tipoescala
				FROM mod_evaluaciones.dat_evalescala dee
				WHERE dee.idescala = '$idescala'";
            $tipoEscala = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $tipoEscala = $tipoEscala[0]['tipoescala'];

            if ($tipoEscala == 0) { //Escalas de rango n�merico
                $DatEvalescalarangonumerico = new DatEvalescalarangonumerico();
                $result = $DatEvalescalarangonumerico->getValoresEscala($idescala);
                foreach ($result as &$r) {
                    $r['tipoescala'] = $tipoEscala;
                }
                /* $sql="SELECT drn.idrangonumerico as idescala, drn.valorinicial, drn.valorfinal, drn.paso, dee.tipoescala

                  FROM
                  mod_evaluaciones.dat_evalescala dee
                  INNER JOIN mod_evaluaciones.dat_evalrangonumerico drn ON (dee.idescala = drn.idescala)

                  WHERE
                  dee.idescala = '$idescala'";
                  $arrAux=$query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                  $i = $arrAux[0]['valorinicial']; */
                /* $id = 0;
                  do{
                  $result[] = array('idescala'=>$id, 'denom'=>$i, 'descripcion'=>'', 'tipoescala'=>$arrAux[0]['tipoescala']);

                  $i += $arrAux[0]['paso'];
                  $id++;
                  }
                  while($i<=$arrAux[0]['valorfinal']); */
            } else if ($tipoEscala == 1) { //Escalas cualitativas
                $sql = "SELECT nvc.idvalorescualitativos as idescala, nvc.denom, nvc.descripcion, dee.tipoescala

					FROM
					  mod_evaluaciones.dat_evalescala dee
					  INNER JOIN mod_evaluaciones.dat_evalescalavalorescualitativos devc ON (dee.idescala = devc.idescala)

					  INNER JOIN mod_evaluaciones.nom_evalvalorescualitativos nvc ON (devc.idvalorescualitativos = nvc.idvalorescualitativos)
					WHERE
					  dee.idescala = '$idescala' and nvc.idvalorescualitativos = {$idvalor}";

                $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            } else if ($tipoEscala == 2) { //Escalas de imagen
                $sql = "SELECT nvi.idvaloresimagenes, devi.idescala, devi.idevalescalavaloreimagene as idevalescalavaloreimagene, nvi.denom, nvi.descripcion, nvi.extension, dee.tipoescala
					FROM

					  mod_evaluaciones.dat_evalescala dee
					  INNER JOIN mod_evaluaciones.dat_evalescalavaloresimagen devi ON (dee.idescala = devi.idescala)
					  INNER JOIN mod_evaluaciones.nom_evalvaloresimagenes nvi ON (devi.idvaloresimagenes = nvi.idvaloresimagenes)

					WHERE
					  dee.idescala = '$idescala' and nvi.idvaloresimagenes = {$idvalor}";

                $varAux = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                foreach ($varAux as $imagen) {
                    $result[] = array('idevalescalavaloreimagene' => $imagen['idevalescalavaloreimagene'], 'idvaloresimagenes' => $imagen['idvaloresimagenes'], 'idescala' => $imagen['idescala'], 'denom' => '../../../plantillas/nomvalimgs/' . $imagen['idvaloresimagenes'] . $imagen['extension'], 'descripcion' => $imagen['descripcion'], 'tipoescala' => $imagen['tipoescala']);
                }
            }
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Agregar a una consulta las sentencias necesarias para obtener los datos de la escala.
     *
     * @param Doctrine_Query $objDoctrineQuery Consulta a la cual se le quiere agregar las sentencias DQL.
     * @param string $aliasTablaReferencia Alias de la clase de dominio que tiene relación con la clase.
     * @return Doctrine_Query Consulta modificada con las sentencias que devuelven los datos personales.
     */
    public function addDqlEscala(Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla) {
        return $objDoctrineQuery->addSelect("$aliasTabla.idescala as idescala, $aliasTabla.denom as denomescala
            , $aliasTabla.descripcion as descripcionescala, $aliasTabla.tipoescala as tipoescala")
                        ->innerJoin("$aliasTablaReferencia.DatEvalescala $aliasTabla");
    }
    
      public function eliminarescala($idescala)
    {   
        try{
            $query = Doctrine_Query::create();
            $query->from('DatEvalescala');
            if(is_array($idescala)){
                $query->whereIn('idescala', $idescala);
            }elseif(is_numeric($idescala)){
                $query->where('idescala = ?', $idescala);
            }
            $result = $query->execute();
            $result->delete();
        }catch (Doctrine_Exception $e){
            throw $e;
        }
        
    }

}
