<?php

class DatElementoExpresionmatematicaModel extends ZendExt_Model {

    public function DatElementoExpresionmatematicaModel() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatElementoExpresionmatematica $DatElementoExpresionmatematica) {
        $this->conn->beginTransaction();
        try {
            $DatElementoExpresionmatematica->save();
            $this->conn->commit();
            return $DatElementoExpresionmatematica->idexpresionmatematica;
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function Actualizar(DatElementoExpresionmatematica $DatElementoExpresionmatematica) {
        $this->conn->beginTransaction();
        try {
            $DatElementoExpresionmatematica->save();
            $this->conn->commit();
            return $DatElementoExpresionmatematica->idexpresionmatematica;
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function ActualizarElementos($idexpresionmatematica, $arrElementos) {
	    try {
            $cantidad = count($arrElementos);
            if ($cantidad > 0) {
                $coleccion = new Doctrine_Collection('DatElementoExpresionmatematica');
                foreach ($arrElementos as $k => $v) {
				    //print_r($v);die;
                    $coleccion[$k]->idexpresionmatematica = $idexpresionmatematica;
                    $coleccion[$k]->elemento = $v['valor'];
                    $coleccion[$k]->tipoelemento =$v['tipo'];
                    $coleccion[$k]->valormostrar = $v['valormostrar'];

                    if ($v['tipo'] == 6) {
                        $arr = explode('I', $v['valor']);
						$coleccion[$k]->idindicador = $arr[1];
                    } else {
                        $coleccion[$k]->idindicador = 0;
                    }
                    $coleccion[$k]->orden = $k;
                }
                $coleccion->save();
            }
            return true;
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function Eliminar($id) {
        try {
            $DatElementoExpresionmatematica = Doctrine::getTable('DatElementoExpresionmatematica')->find($id);
            if ($DatElementoExpresionmatematica != false) {
                $DatElementoExpresionmatematica->delete();
                return true;
            }
        } catch (Doctrine_Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function EliminarElementos($idexpresionmatematica) {
        $sql = "delete from mod_utiles.dat_elementoexpresionmatematica where idexpresionmatematica = {$idexpresionmatematica};";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function ObtenerIndicadoresporExpMat($idexpresionmatematica) {
        //Si no existe el fichero lo creo y devuelvo los indicadores
        if (!file_exists("indicadoresexpresonmatematica/{$idexpresionmatematica}.iem")) {
            $em = new DatElementoExpresionmatematica();
            $arrInd = $em->GetIndicadoresporExpresionMatematica($idexpresionmatematica);
            $arr = array();
            if (count($arrInd) > 0) {
                foreach ($arrInd as $i => $v) {
                    $arr[] = $v['idindicador'];
                }
                $s = serialize($arr);
                $fp = fopen("indicadoresexpresonmatematica/{$idexpresionmatematica}.iem", "w");
                fwrite($fp, $s);
                fclose($fp);
            }

            return $arr;
        } else {
            //Devuelvo los indicadores guardados en el fichero serializado - Mejorando el tiempo de respuesta
            $fp = fopen("indicadoresexpresonmatematica/{$idexpresionmatematica}.iem", "r");
            $contenido = fread($fp, filesize("indicadoresexpresonmatematica/{$idexpresionmatematica}.iem"));
            $uns = unserialize($contenido);
            fclose($fp);
            return $uns;
        }
    }

}

//Fin clase
?>
