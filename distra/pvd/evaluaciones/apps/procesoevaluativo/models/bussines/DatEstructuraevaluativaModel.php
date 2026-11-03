<?php

class DatEstructuraevaluativaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Guarda la estructura evaluativa
     *
     * @param      $arrIdEstructura        Lista de identificadores de cargos
     * @param      $idpadre                Identificador de la estructura evaluativa padre
     * @param      $idpreprocesoevaluativo Identificador del proceso evaluativo
     * @param bool $addPerson Si se van a adicionar las personas automaticamente asociadas al cargo
     * @param null $idprocesoplanilla Identificador de la planilla evaluativa
     */
    public function save($arrIdEstructura, $idpadre, $idpreprocesoevaluativo, $addPerson = false, $idprocesoplanilla = null, $arrIdPersona = array())
    {
        $objDomain = new DatEstructuraevaluativa();
        $dcEstEvaluativa = new Doctrine_Collection('DatEstructuraevaluativa');

        $arrIdEstNew = array();
        $arrIsCargo = array();
        //Adiciona las estructuras
        foreach ($arrIdEstructura as $key => $v) {
            //Verifica que la estructura no exista
            $result = $objDomain->getEstructuraevaluativa($idpreprocesoevaluativo, $v->id, $idpadre);			
           // if (empty($result)) {
                $arrIdEstNew[] = $v->id;
                $arrIsCargo[$v->id] = $v->cargo;
                //Si no existe la adiciona
                $dcEstEvaluativa[$key]->idestructura = $v->id;
                $dcEstEvaluativa[$key]->idpreprocesoevaluativo = $idpreprocesoevaluativo;
                if ($idpadre) {
                    $dcEstEvaluativa[$key]->idpadre = $idpadre;
                }
            //}
        }		 
        $dcEstEvaluativa->save();			
        if ($addPerson) {
            $dcEstPersona = new Doctrine_Collection('DatEstructurapersona');
//            $personas = $this->integrator->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrIdEstNew);
            //if ($arrIdPersona) {
				 
                foreach ($dcEstEvaluativa as $i => $estEvaluativa) {               				
                    foreach ($arrIdPersona as $j => $persona) {
                        if ($estEvaluativa->idestructura == $persona->idcargo) {
                            $dcEstPersona[$j]->idestructuraevaluativa = $estEvaluativa->idestructuraevaluativa;
                            $dcEstPersona[$j]->idpersona = $persona->idpersona;
                            $dcEstPersona[$j]->idprocesoplanilla = $idprocesoplanilla;
                        }
                    }

                    if ($arrIsCargo[$estEvaluativa->idestructura] === 0) {
                        $cont = count($dcEstPersona);
                        $dcEstPersona[$cont]->idestructuraevaluativa = $estEvaluativa->idestructuraevaluativa;
                        $dcEstPersona[$cont]->idpersona = $estEvaluativa->idestructura;
                        $dcEstPersona[$cont]->idprocesoplanilla = $idprocesoplanilla;
                        $dcEstPersona[$cont]->nopersona = 1;
                        $cont++;
                    }
                }
                $dcEstPersona->save();
            //}
        }
    }

    /**
     * Obtiene la estructura evaluativa de forma arbolica
     *
     * @param $idpreprocesoevaluativo
     * @param $idpadre
     *
     * @return array
     */
    public function getTreeEstructuraEvaluativa($idpreprocesoevaluativo, $idpadre)
    {

        $objDomain = new DatEstructuraevaluativa();
        $result = $objDomain->getAll($idpreprocesoevaluativo, $idpadre);

        foreach ($result as &$estructuraEvaluativa) {
            $ruta = $this->integrator->metadatos->getRutaEstructura(array($estructuraEvaluativa['idestructura']));
            $estruc = $this->integrator->metadatos->DameEstructura($estructuraEvaluativa['idestructura']);
            $arrText = explode("=>", $ruta[0]['rutaDenominacion']);
            $cant = count($arrText);

            $estructuraEvaluativa['text'] = $arrText[$cant - 1] . ' / <i>' . $arrText[$cant - 2] . '</i>';
            $estructuraEvaluativa['qtip'] = $ruta['rutaDenominacion'];
            $estructuraEvaluativa['idconcepto'] = $estruc[0]->idtipo;
            $estructuraEvaluativa['icon'] = $estruc[0]->icon;

        }
        return $result;
    }

    /**
     * Elimina una estructura evaluativa
     *
     * @param $idestructura
     *
     * @return bool Devuelve si verdadero si se elimino satisfactoriamente
     */
    public function delete($idestructuraevaluativa)
    {
        try {
            Doctrine_Query::create()
                ->delete()
                ->from('DatEstructuraevaluativa')
                ->where('idestructuraevaluativa = ?', $idestructuraevaluativa)
                ->execute();

            return true;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                return false;
            }
        }
    }

    public function limpiar($idpreprocesoevaluativo, $idprocesoplanilla)
    {
        // try {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "DELETE FROM mod_evaluaciones.dat_estructurapersona
				  WHERE idestructuraevaluativa IN (SELECT idestructuraevaluativa
				  FROM mod_evaluaciones.dat_estructuraevaluativa
				  WHERE idpreprocesoevaluativo =$idpreprocesoevaluativo)";

        $r = $conn->fetchAll($sql);

        $sql_array = "SELECT ev.idestructura
						  FROM mod_evaluaciones.dat_estructuraevaluativa ev
						  WHERE ev.idpreprocesoevaluativo=$idpreprocesoevaluativo";

        $result = $conn->fetchAll($sql_array);

        $arrCargo = array();
        foreach ($result as $cargo) {
            $arrCargo[] = $cargo['idestructura'];
        }

        $dcEstEvaluativa = "SELECT idestructuraevaluativa, idestructura
				  FROM mod_evaluaciones.dat_estructuraevaluativa
				  WHERE dat_estructuraevaluativa.idpreprocesoevaluativo= $idpreprocesoevaluativo";

        $arrEstructura = $conn->fetchAll($dcEstEvaluativa);

        $dcEstPersona = new Doctrine_Collection('DatEstructurapersona');
        $personas = $this->integrator->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrCargo);

        if ($personas) {
            foreach ($arrEstructura as $i => $estEvaluativa) {
                foreach ($personas->data as $j => $persona) {
                    if ($estEvaluativa['idestructura'] == $persona['idcargo']) {
                        $dcEstPersona[$j]->idestructuraevaluativa = $estEvaluativa['idestructuraevaluativa'];
                        $dcEstPersona[$j]->idpersona = $persona['idpersona'];
                        $dcEstPersona[$j]->idprocesoplanilla = $idprocesoplanilla;
                    }
                }
            }
            $dcEstPersona->save();
        }

        return true;
        //}
        /*catch (Exception $e)         {

            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                return false;
            }
        }*/
    }

    public function Modificar($idEstructura, $idEstructuraPadre)
    {
        $query = Doctrine_Query::create()
            ->update()
            ->from('DatEstructuraevaluativa')
            ->set('idpadre', '?', $idEstructuraPadre)
            ->where('idestructuraevaluativa =?', $idEstructura);
        $query->execute();
    }
	
}
