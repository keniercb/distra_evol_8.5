<?php

/**
 * Clase que implementa todos los métodos relacionados con el comportamiento de un registro numérico como un módulo
 *
 * @autor Jorge Luis Cuellar Mondeja
 */
class RegNumericoModuloModel extends BaseModel
{

    private $mRegNumModTraza, $mProdModLogico;

    public function __construct()
    {
        parent::__construct();

        if (!class_exists('DatRegnumericoActivo')) {
            throw new ZendExt_Exepction('LOG_AFT_RN_004');
        }

        $this->mRegNumModTraza = new RegNumericoModuloTrazaModel();
        $this->mProdModLogico = new ProdModuloLogicoModel();
    }

    /**
     *
     */
    private function crearModuloDragDropSavedDestino($idRegNumericoDestino)
    {
        $datRegNumericoActivo = 'DatRegnumericoActivo';
        if ($idRegNumericoDestino) {
            $rnDestino = Doctrine::getTable('DatRegnumerico')->find($idRegNumericoDestino);
            $rnDestino->$datRegNumericoActivo->esmodulo = 2;
//            $rnDestino->$datRegNumericoActivo->asignado = 2;
            $rnDestino->save();
            return $rnDestino;
        }
    }

    /**
     *  Para cuando se trata de poner un padre dentro de un hijo
     */
    private function crearModuloDragDropAux($objOrigen, $rnDestino)
    {
        $datRegNumericoActivo = 'DatRegnumericoActivo';
        if ($objOrigen->ordenizq < $rnDestino->$datRegNumericoActivo->ordenizq && $rnDestino->$datRegNumericoActivo
            ->ordender < $objOrigen->ordender) {
            $rnDestino->$datRegNumericoActivo->idpadre = $rnDestino->idregnumerico;
            $rnDestino->save();
        }
    }

    public function getHijosModulo($izq, $der, $idarbol)
    {
        if (!$idarbol) {
            // No borrar este die, ver a Adrian
            die(
                'No llega el idarbol como parametro al metodo. class=>RegNumericoModuloModel,
                method=>getHijosModulo(izq, der, idarbol)'
            );
        } else {
                $query = new Doctrine_Query();

                $query->select(
                    'rn.idregnumerico, prod.idproducto as idproducto, prod.idindicador as idprod,'
                    . ' i.idtabla as idtabla,i.arridtablas as arridtablas'
                )
                    ->from('DatRegnumerico rn')
                    ->innerJoin('rn.DatRegnumericoActivo rna')
                    ->innerJoin('rn.DatProductoLogistica prod')
                    ->innerJoin('prod.NomIndicador i')
                    ->where("rna.ordenizq >= ? AND rna.ordender <= ? AND rna.idarbol=?", array($izq, $der, $idarbol));
//                print_r($idarbol);die;
//            print_r($query->fetchArray());die("safadsfa");
                return $query->fetchArray();
        }
    }

    public function asignarHijosModulo($regPadre, $arrRegHijos, $plantilla)
    {
        $collRegNumActivo = new Doctrine_Collection('DatRegnumericoActivo');
        $cDatRegnumericoActivo = 'DatRegnumericoActivo';
        $cDatPlantilla = 'DatPlantilla';

        for ($i = 0; $i < count($arrRegHijos); $i++) {
            if ($plantilla == true) {
                $arrIdesRegNumericosNumerico = $arrRegHijos[$i];
                $idPadreRegNumerico = $regPadre->idregnumerico;
                $denominacionPlantilla = $regPadre->$cDatRegnumericoActivo->$cDatPlantilla->denominacion;

                $conn = Zend_Registry::get('conexion');
                $conn->fetchAll(
                    "SELECT * FROM \"mod_logactivofijotangible\".\"f_duplicaarbol\"" .
                    "($arrIdesRegNumericosNumerico, 1, '$denominacionPlantilla', $idPadreRegNumerico)"
                );
            } else {

                $regNumerico = Doctrine::getTable('DatRegnumericoActivo')->find($arrRegHijos[$i]);
                $regNumerico->idpadre = $regPadre->idregnumerico;
                $regNumerico->asignado = 2;

                $collRegNumActivo->add($regNumerico);
            }
        }

        $collRegNumActivo->save();
        $regPadre->$cDatRegnumericoActivo->esmodulo = 2;
        $regPadre->$cDatRegnumericoActivo->asignado = 2;
        $regPadre->save();
    }

    public function actualizarHijosModulo($arrIdesRegNumericosNumericos)
    {
        $query = Doctrine_Query::create();

        $query->update('DatRegnumericoActivo reg')
            ->set('reg.idpadre', 'reg.idregnumerico')
            ->whereIn('reg.idregnumerico', $arrIdesRegNumericosNumericos)
            ->execute();
    }

    public function getSonModulos($arrIdesRegNumericosNumericos, $idAreaResp, $id)
    {
        $mRegNumActivo = new RegNumericoActivoModel();
        $parametros['idestructuraop'] = $idAreaResp;
        $parametros['modulo'] = 1;

        if (!$id) {
            $parametros['asignado'] = 2;
        }

        $datos = $mRegNumActivo->getMediosDisponibles($parametros);
        return $this->getBuscarPadres($datos['datos'], $arrIdesRegNumericosNumericos);
    }

    public function deleteHijosModulo($ordenIzq, $ordenDer, $idarbol)
    {
        if ($idarbol) {
            $mRegNumActivo = new RegNumericoActivoModel();

            $query = $mRegNumActivo->getQueryRegNumerico('rn');
            $query->delete()
                ->where(
                    "rn.idregnumerico IN (SELECT rna.idregnumerico FROM DatRegnumericoActivo rna
                    WHERE rna.ordenizq >= $ordenIzq AND rna.ordender <= $ordenDer AND rna.idarbol=$idarbol)"
                )->execute();
        } else {
            die(
                'No llega el idarbol como parametro al metodo. class=>RegNumericoModuloModel,
                method=>deleteHijosModulo(izq, der, idarbol)'
            );
        }
    }

    public function getBuscarPadres($arrRegNumericos, $arrIdesRegNumericosNumericos)
    {
        foreach ($arrRegNumericos as $value) {
            if ($value['idregnumerico'] == $arrIdesRegNumericosNumericos) {
                if ($value['idpadremodulo'] != $value['idregnumerico']) {
                    return self::getBuscarPadres($arrRegNumericos, $value['idpadremodulo']);
                }

                array_push($arrIdesRegNumericos, $value['idregnumerico']);
            }
        }
        return $arrIdesRegNumericos;
    }

    /**
     * Adicionar módulos
     */
    public function adicionarModulo($parametros)
    {
        $mRegNumActivo = new RegNumericoActivoModel();
        $mRegNumActivo->ordenarArbolModulosRegNumericos();

        if ($parametros->idmodulo != 0) {
            $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($parametros->idmodulo);

            if (count($parametros->medios) > 1) {
                $idAreaResp = $parametros->idarea;
                $modulo = $parametros->idmodulo;

                $colleObj = new Doctrine_Collection('DatRegnumericoActivo');

                foreach ($parametros->medios as $key => $value) {

                    $regNumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
                    $regNumActivo->asignado = 2;
                    $regNumActivo->idpadre = $modulo;
                    $regNumActivo->idarbol = $parametros->idarbol;
                    $regNumActivo->idarearesp = $idAreaResp;
                    $colleObj->add($regNumActivo);
                }
                $moduloPadre->esmodulo = 2;
                $moduloPadre->save();
                $colleObj->save();
            } else {

                $regNumActivo = Doctrine::getTable('DatRegnumericoActivo')
                    ->find($parametros->medios[0]->idregnumerico);

                $regNumActivo->asignado = 2;
                $regNumActivo->idpadre = $parametros->idmodulo;
                $regNumActivo->idarearesp = $parametros->idarea;
                $regNumActivo->idarbol = $parametros->idarbol;

                $moduloPadre->esmodulo = 2;
                $moduloPadre->save();
                $regNumActivo->save();
                $mRegNumActivo->ordenarArbolModulosRegNumericos($moduloPadre->idregnumerico);
            }
            $this->mRegNumModTraza->guardarTrazaAdicionar($parametros);
        } else {
            if (count($parametros->medios) > 1) {

                $area = $parametros->idarea;
                $colleObj = new Doctrine_Collection('DatRegnumericoActivo');
                foreach ($parametros->medios as $key => $value) {
                    $regNumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($value->idregnumerico);
                    $regNumActivo->asignado = 2;
                    $regNumActivo->esmodulo = 1;
                    $regNumActivo->idarearesp = $area;
                    $regNumActivo->idpadre = $value->idregnumerico;
                    $regNumActivo->save();
                    $colleObj->add($regNumActivo);
                }
                $colleObj->save();
            } else {

                $regNumActivo = Doctrine::getTable('DatRegnumericoActivo')
                    ->find($parametros->medios[0]->idregnumerico);
                $regNumActivo->asignado = 2;
                $regNumActivo->idarearesp = $parametros->idarea;
                $regNumActivo->idpadre = $parametros->medios[0]->idregnumerico;
                $regNumActivo->save();
                $mRegNumActivo->ordenarArbolModulosRegNumericos($parametros->medios[0]->idregnumerico);
            }
        }

        $mRegNumActivo->ordenarArbolModulosRegNumericos();
    }

    public function getEliminarHijosDeModulos($parametros)
    {
        $mRegNumActivo = new RegNumericoActivoModel();

        if ($parametros->idregnumerico == $parametros->idarbol) {
            $hijosPadres = Doctrine::getTable('DatRegnumericoActivo')
                ->findByDql("idarbol = $parametros->idarbol and idregnumerico <> $parametros->idregnumerico"
                );
        } else {
            $hijosPadres = Doctrine::getTable('DatRegnumericoActivo')
                ->findByDql("idpadre = $parametros->idregnumerico and idregnumerico <> $parametros->idregnumerico"
                );
        }


        if (count($hijosPadres->toArray()) > 0) {
            foreach ($hijosPadres->toArray() as $index => $datos) {
                if ($datos['esmodulo'] == 2) {
                    $params[0]->idregnumerico = $datos['idregnumerico'];
                    $params[0]->ordenizq = $datos['ordenizq'];
                    $params[0]->ordender = $datos['ordender'];
                    $params[0]->esmodulo = $datos['esmodulo'];
                    $this->eliminarModulos($params);
                }
                $modulo = Doctrine::getTable('DatRegnumericoActivo')->find($datos['idregnumerico']);
                $modulo->esmodulo = 1;
                $modulo->asignado = 1;
                $modulo->idarbol = $datos['idregnumerico'];
                $modulo->idpadre = $datos['idregnumerico'];
                $modulo->save();

                $mRegNumActivo->ordenarArbolModulosRegNumericos();
                /*if ($idPadreModulo != $modulo->idregnumerico) {
                    $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($idPadreModulo);
                    if ($moduloPadre->ordender - $moduloPadre->ordenizq == 1) {
                        $moduloPadre->esmodulo = 1;
                        $moduloPadre->save();
                    }
                }*/
            }
            $mRegNumActivo->ordenarArbolModulosRegNumericos();
        }
    }

    /**
     * Eliminar módulos
     */
    public function eliminarModulos($parametros)
    {

        $mRegNumActivo = new RegNumericoActivoModel();
        //$this->mRegNumModTraza->guardarTrazaEliminar($parametros);

        for ($i = 0; $i < count($parametros); $i++) {

            if ($parametros[$i]->esmodulo == 2) {
                $this->getEliminarHijosDeModulos($parametros[$i]);
                $padreordenizq = $parametros[$i]->ordenizq;
                $padreordender = $parametros[$i]->ordender;

                Doctrine_Query::create()
                    ->update('DatRegNumericoActivo')
                    ->set('idpadre', 'idregnumerico')
                    ->set('asignado', 1)
                    ->set('esmodulo', 1)
                    ->set('idarbol', 1)
                    ->where('ordenizq > ? AND ordender < ?', array($padreordenizq, $padreordender))
                    ->execute();
            }

            $modulo = Doctrine::getTable('DatRegnumericoActivo')->find($parametros[$i]->idregnumerico);
            $idPadreModulo = $modulo->idpadre;

            $modulo->esmodulo = 1;
            $modulo->asignado = 1;
            $modulo->idarbol = $modulo->idregnumerico;
            $modulo->idpadre = $modulo->idregnumerico;
            $modulo->save();


            $mRegNumActivo->ordenarArbolModulosRegNumericos();

            if ($idPadreModulo != $modulo->idregnumerico) {
                $moduloPadre = Doctrine::getTable('DatRegnumericoActivo')->find($idPadreModulo);
                if ($moduloPadre->ordender - $moduloPadre->ordenizq == 1) {
                    $moduloPadre->esmodulo = 1;
                    $moduloPadre->save();
                }
            }
        }
        $mRegNumActivo->ordenarArbolModulosRegNumericos();
    }

    /**
     * Obtener listado de módulos
     */
    public function obtenerModulos($parametros)
    {
         
        new DatProductoModulo();
        $sRegNumActivo = new RegNumActivoService();       
        $datos = $sRegNumActivo->getMediosDisponibles($parametros);       
        foreach ($datos['datos'] as $index =>&$value) {
            $value['_id'] = $value['idregnumerico'];
            $value['_is_leaf'] = ($value['esmodulo'] == 1) ? true : false;
            $value['_parent'] = ($value['idpadremodulo'] == $value['idregnumerico']) ? null : $value['idpadremodulo'];
            $value['denominacion'] = ($value['denominacionPModulo']) ?
                $value['denominacionPModulo'] : $value['denominacionIndicador'];
            $value['denominacion'] = ($value['denominacion'] == null) ?
                $value['DatProductoModulo']['denominacion'] : $value['denominacion'];           
            if ($value['esmodulo'] == 2) {              
                $datos['datos'][$index]['valorcontable'] = $datos['datos'][$index]['valormodulo'];
                $datos['datos'][$index]['valormoduloalternativo'] = $datos['datos'][$index]['valormoduloalternativo'];
            }
        }
        //print_r($datos['datos']);die;

        return $datos;
    }
   
    /**
     *
     */
    public function crearModuloDragDrop($arrIdesOrigen, $idRegNumericoDestino)
    {
        $mRegNumActivo = new RegNumericoActivoModel();
        $rnDestino = $this->crearModuloDragDropSavedDestino($idRegNumericoDestino);
        foreach ($arrIdesOrigen as $idOrigen) {

            // Si existe destino se le pongo el id padre del destino, sino pongo su mismo idpadre.
            $objOrigen = Doctrine::getTable('DatRegnumericoActivo')->find($idOrigen);
            $objPadre = Doctrine::getTable('DatRegnumericoActivo')->find($objOrigen->idpadre);
            $objOrigen->idpadre = ($idRegNumericoDestino) ? $rnDestino->idregnumerico : $idOrigen;
            $objOrigen->idarbol = ($idRegNumericoDestino) ? $rnDestino->{'DatRegnumericoActivo'}->idarbol : $idOrigen;
            $objOrigen->save();

            // Para cuando se trata de poner un padre dentro de un hijo
            $this->crearModuloDragDropAux($objOrigen, $rnDestino);
            $hijosOrigen = Doctrine::getTable('DatRegnumericoActivo')
                ->findByDql("idpadre = $objOrigen->idregnumerico and idregnumerico <> $objOrigen->idregnumerico");
            $condicion = (!$hijosOrigen || count($hijosOrigen) == 0) ? 1 : 2;
            $objOrigen->esmodulo = $condicion;
            $objOrigen->asignado = ($objOrigen->idregnumerico == $objOrigen->idpadre &&
                (!$hijosOrigen || count($hijosOrigen) == 0)) ? 1 : 2;

            $objOrigen->save();

            //  Padres
            $hijosPadres = Doctrine::getTable('DatRegnumericoActivo')
                ->findByDql("idpadre = $objPadre->idregnumerico and idregnumerico <> $objPadre->idregnumerico");
            $objPadre->esmodulo = (!$hijosPadres || count($hijosPadres) == 0) ? 1 : 2;
            $objPadre->save();
        }

        $mRegNumActivo->initReNumActivoModel();
        $mRegNumActivo->ordenarArbolModulosRegNumericos($rnDestino->idregnumerico);
        return true;
    }

    /**
     * Busca los números de inventarios que se repiten.
     */
    public function getBuscarNroInvRepetidos($arrNrosInventario, $idAreaResp)
    {
        $query = Doctrine_Query::create();
        $query->from('DatRegnumericoActivo rna');
        $query->where("rna.idarearesp = ?", $idAreaResp);
        $query->whereIn("rna.nroinventario", $arrNrosInventario);

        return $query->count();
    }

    /**
     * Eliminar las nomenlcaturas de módulo que tienen  números de inventario
     */
    public function eliminarModuloAsociadoNroinventario($parametros)
    {
        if (count($parametros)) {
            $arrIdesRegNumericos = array();

            for ($i = 0; $i < count($parametros); $i++) {
                $arrIdesRegNumericos[] = $parametros[$i]->idregnumerico;
            }
            Doctrine_Query::create()->delete()
                ->from('DatRegnumerico')
                ->whereIn('idregnumerico', $arrIdesRegNumericos)
                ->execute();
        }
    }

    /**
     * Asociar una nomenclatura de módulo con un número de inventario
     */
    public function asociarNomenclaturaNroInventario($parametros, $idAreaResp)
    {
        $cProductoModulo = 'DatProductoModulo';
        if ($parametros[2]) {
            $objDarRegNum = Doctrine::getTable('DatRegnumerico')->find($parametros[2]);
            $objDregNumActivo = Doctrine::getTable('DatRegnumericoActivo')->find($objDarRegNum->idregnumerico);
        } else {
            $objDarRegNum = new DatRegnumerico();
            $objDregNumActivo = new DatRegnumericoActivo();
        }

        if (is_string($parametros[0])) {

            $exis = $this->mProdModLogico->existeModuloLogico($parametros[0], $idAreaResp);
            if ($exis >= 1) {
                $producto = Doctrine::getTable('DatProductoModulo')->findBy('denominacion', $parametros[0]);
                $objDarRegNum->idproducto = $producto[0]->idproducto;
            } else {
                new DatProductoModulo();
                $producto = new DatProductoLogistica();

                $producto->$cProductoModulo->denominacion = $parametros[0];
                $producto->idestructura = $idAreaResp;

                $producto->save();
                $objDarRegNum->idproducto = $producto->idproducto;
            }
        } else {
            $objDarRegNum->idproducto = $parametros[0];
        }
        $objDarRegNum->save();

        $objDregNumActivo->idregnumerico = $objDarRegNum->idregnumerico;
        $objDregNumActivo->nroinventario = $parametros[1];
        $objDregNumActivo->idarearesp = $idAreaResp;
        $objDregNumActivo->estaentidad = 1;
        $objDregNumActivo->save();

        return 1;
    }

    /**
     * Obtener los datos de un módulo con sus hijos
     */
    public function getDatosHijosModulo($parametros)
    {

        new DatProductoModulo();
        $sRegNumActivo = new RegNumActivoService();
        $datos = $sRegNumActivo->getMediosDisponibles($parametros);
        foreach ($datos['datos'] as &$value) {
            $value['imagenes'] = self::getIdImagenIndicador($value['idindicador']);

            if (!$value['idindicador']) {
                $value['text'] = $value['denominacion'];
            }
        }

        return $datos;
    }

    /**
     *  Obtener arreglo de identificadores de las imagenes asociadas a un indicador
     */
    public function getIdImagenIndicador($idIndicador)
    {
        $resultado = array();
        if ($idIndicador) {
            $conn = Zend_Registry::get('conexion');
            $resultado = $conn->execute(
                "SELECT idimagen FROM mod_datosmaestros.dat_imagenindicador "
                . "WHERE idindicador = $idIndicador"
            )->fetchAll(PDO::FETCH_COLUMN);

        }

        return $resultado;
    }

}
