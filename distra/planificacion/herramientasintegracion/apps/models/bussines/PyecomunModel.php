<?php

class PyecomunModel extends ZendExt_Model
{
    public function setUp() {
        parent::ZendExt_Model();
    }

    /**
     * @copyright XETID Cuba
     * @author    Ing Grabiel Montero Coello
     *
     * @param $estudioModel : Clase modelo para obtener los datos
     * @param $idProyecto : Identificador del proyecto al que pertenece la situación actual
     *
     * @return mixed
     */
    public static function getEstudioByProyecto($estudioModel, $idProyecto) {
        $concepto = $estudioModel::getByProyecto($idProyecto);
        return $concepto;
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @param $sujetoFila : Denominación del sujeto que corresponde a la variable fila de la matriz de impacto cruzado
     * @param $sujetoColumna : Denominación del sujeto que corresponde a la variable columna de la matriz de impactocruzado
     * @param $idProyecto : Identificador del proyecto asociado a la situación actual
     * @return mixed
     */
    public static function getSujetosImpacto($sujetoFila, $sujetoColumna, $idProyecto) {
        $estudio = DatEstudiomatrizimpactocruzado::getByProyecto($idProyecto);
        $variableFila = DatVariableimpactocruzado::getVariableByProyectoEstudio($sujetoFila, $estudio[0]['idestudiomatrizimpactocruzado']);
        $variableColumna = DatVariableimpactocruzado::getVariableByProyectoEstudio($sujetoColumna, $estudio[0]['idestudiomatrizimpactocruzado']);
        $matrizImpacto = DatMatrizimpactocruzado::getMatrizByFilaColumna(
            $variableFila['idvariable'], $variableColumna['idvariable']
        );
        if (count($matrizImpacto)) {
            return NomImpactoflujos::getByid($matrizImpacto[0]['idimpacto']);
        } else return array();
    }

    /**
     * @copyright XETID Cuba
     * @author    Ing Grabiel Montero Coello
     *
     * @param $tabla : Tabla que contiene los datos a obtener
     *
     * @return mixed
     */
    public static function getNomenclador($tabla) {
        return $tabla::getAll();
    }
    //------------------------------------------------------------------------

    public function getDatosGraficoOrganigrama($objefecto){
        $categorias = DatEfectoModel::generarDiagrama($objefecto);
        $nodes = array();
        $edges = array();
        $longCadenas = 25;

        $denEfecto = $this->partirCadena($objefecto['denominacion'], $longCadenas);
        $nodes[] = array("id" => 1, "label" => $denEfecto, "title" => $denEfecto, "level" => 0, "group" => "efecto");

        foreach($categorias as $key => $objCategorias){
            $idCategoria = 'cat'.$objCategorias['idcategoria'];
            $denCategoria = $this->partirCadena($objCategorias['denominacion'], $longCadenas);

            $pos = count($nodes) - 1;
            $level = $nodes[$pos]['level'];

            if($level == 0){
                $level ++;
            }

            $nodes[] = array("id" => $idCategoria, "label" => $denCategoria, "title" => $denCategoria, "level" => $level, "group" => "categoria");
            $edges[] = array("from" => 1, "to" => $idCategoria, "label" => '', "dashes" => false, "color" => "#C5000B", "width" => 1);

            $result = $this->devolverRama($objCategorias['DatCausa'], ($level + 1), $longCadenas);

            foreach($result as $keyRes => $objRes){
                $nod = $objRes['nodes'];
                $edg = $objRes['edges'];

                foreach($nod as $keyNod => $objNod){
                    $nodes[] = $objNod;
                }
                foreach($edg as $keyEdg => $objEdg){
                    $edges[] = $objEdg;
                }
            }
        }

        return array("nodes"=> $nodes, "edges"=> $edges);
    }

    public function devolverRama($causas, $level, $longCadenas){

        $roots = array();
        foreach($causas as $key => $objCausa){
            if($objCausa['idcausa'] == $objCausa['idpadre']){
                $roots[] = $objCausa;
            }
        }

        $long = count($roots);
        for($i = 0; $i < $long - 1; $i++){
            for($j = ($i + 1); $j < $long; $j++){
                if($roots[$j]['lft'] < $roots[$i]['lft']){
                    $aux = $roots[$j];
                    $roots[$j] = $roots[$i];
                    $roots[$i] = $aux;
                }
            }

        }

        $result = array();
        foreach($roots as $key => $objRoot){
            $nodos = array();
            $ejes = array();
            $result[] = $this->agregarCausas($objRoot, $causas, $nodos, $ejes, $level, $longCadenas);
        }
        return $result;
    }

    public function agregarCausas($objCausa, $causas, $nodes, $edges, $nivel, $longCadenas){
        $idCausa = 'cau'.$objCausa['idcausa'];
        $denCausa = $this->partirCadena($objCausa['denominacion'], $longCadenas);

        if($objCausa['idcausa'] == $objCausa['idpadre']){
            $idFrom = 'cat'.$objCausa['idcategoria'];
        }else{
            $idFrom = 'cau'.$objCausa['idpadre'];
        }

        $nodes[] = array("id" => $idCausa, "label" => $denCausa, "title" => $denCausa, "level" => $nivel, "group" => "causa");
        $edges[] = array("from" => $idFrom, "to" => $idCausa, "label" => '', "dashes" => false, "color" => "#C5000B", "width" => 1);

        $result = array();
        if(($objCausa['rgt'] - $objCausa['lft']) == 1){
            $result = array('nodes' => $nodes, 'edges' => $edges);
        }else{

            $hijas = array();
            foreach($causas as $key => $objetoCausas){
                if(($objetoCausas['idpadre'] == $objCausa['idcausa']) && ($objetoCausas['idpadre'] != $objetoCausas['idcausa'])){
                    $hijas[] = $objetoCausas;
                }
            }

            $long = count($hijas);
            foreach($hijas as $key => $objHija){
                if($key < $long - 1){
                    for($i = $key + 1; $i < $long; $i++){
                        if($hijas[$i]['lft'] < $objHija['lft']){
                            $aux = $objHija;
                            $hijas[$key] = $hijas[$i];
                            $hijas[$i] = $aux;
                        }
                    }
                }
            }
            $nivel ++;
            foreach($hijas as $key => $objHija){
                $result = $this->agregarCausas($objHija, $causas, $nodes, $edges, $nivel , $longCadenas);
            }
        }
        return $result;
    }

    public function partirCadena($cadena, $longitud){
        $cadena1 = $cadena;
        if(strlen($cadena1) > $longitud){
            $cadena = wordwrap($cadena1, $longitud, "\n", false);
        }
        return $cadena;
    }
}
