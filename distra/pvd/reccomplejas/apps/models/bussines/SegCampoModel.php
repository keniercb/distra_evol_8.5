<?php

/**
 * Gestiona la compartimentacion de los campos por roles
 * Class SegCampoModel
 *
 * @author Javier Rodriguez Lopez
 */
class SegCampoModel extends ZendExt_Model
{

    private $objSegCampo;

    public function SegCampoModel()
    {
        parent::ZendExt_Model();
        $this->objSegCampo = new SegCampo();
    }

    /**
     * Devuelve la la compartimentacion de los campos en forma de arbol
     *
     * @param $idconfiguracion
     * @param $idrol
     *
     * @return array
     */
    public function getSegCampoAsTree($idconfiguracion, $idrol)
    {
        $list = $this->objSegCampo->getSegCampo($idconfiguracion, $idrol);

        return $this->generateTree($list);
    }

    /**
     * Modifica el acceso por roles  a los campos del recuperador complejo
     *
     * @param $arrAdd
     * @param $arrDel
     */
    public function setAcceso($arrAdd, $arrDel)
    {
        try {
            //Permite el acceso al campo por el rol
            if (!empty($arrAdd)) {
                $dcSegCampo = new Doctrine_Collection('SegCampo');
                foreach ($arrAdd as $key => $campo) {
                    $dcSegCampo[$key]->idcampo = $campo->idcampo;
                    $dcSegCampo[$key]->idrol = $campo->idrol;
                }
                $dcSegCampo->save();
            }

            //Elimina el acceso al campo
            if (!empty($arrDel)) {
                $q = Doctrine_Query::create()
                    ->delete('SegCampo')
                    ->whereIn('idsegcampo', $arrDel)
                    ->execute();
            }

            $r['success'] = true;

            return $r;
        } catch (Exception $e) {
            $r['success'] = false;
            $r['errorMsg'] = $e->getMessage();
            return $r;
        }
    }

    /**
     * Genera un arbol a partir de una lista
     *
     * @param array $array
     * @param int   $idPadre
     *
     * @return array
     */
    private function generateTree(array $array, $idpadre = null)
    {
        $tree = array();
        $j = 0;
        foreach ($array as $key => $nodo) {
            if (empty($idpadre) && empty($nodo['idpadre'])) {
                if (empty($nodo['leaf'])) {
                    $nodo['children'] = $this->generateTree($array, $nodo['idcampo']);
                    $tree[$j++] = $nodo;
                } else {
                    $tree[$j++] = $nodo; //Es un campo hoja sin padre.
                }
            } else {
                if ($nodo['idpadre'] == $idpadre) { //Buscando los nodos hijos
                    if (empty($nodo['leaf'])) {
                        $nodo['children'] = $this->generateTree($array, $nodo['idcampo']);
                        $tree[$j++] = $nodo;
                    } else {
                        $tree[$j++] = $nodo;
                    }
                }
            }
        }

        return $tree;
    }

}