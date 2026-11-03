<?php

/**
 * Componente para gestionar las los formatos de las entidades.
 *
 * @package    Configuración
 * @subpackage Formatos/Models/Bussines
 * @copyright  XETID
 * @version    1.0
 */
class ParteformatoModel extends ZendExt_Model
{

    /**
     * Constuctor de la clase
     */
    public function __constructParteformatoModel() 
    {
        parent::ZendExt_Model();
    }

    /**
     * Insertar nivel de formato
     *
     * @param object $obj Objeto de tipo parte formato
     * @return boolean Retorna verdadero en caso de guardar los datos falso en otro caso
     * @throws Doctrine_Exception $ee Excepción de Doctrine ocurrida durante la transacción.
     */
    public function insertarDatParteformato($obj) 
    {
        try {
            $parteformatono = $obj->buscarParteFormato(array('nombre' => $obj->nombre, 'idformato' => $obj->idformato));
            $parteformatoni = $obj->buscarParteFormato(array('nivel' => $obj->nivel, 'idformato' => $obj->idformato));
            $parteformatoab = $obj->buscarParteFormato(
                    array('abreviatura' => $obj->abreviatura, 'idformato' => $obj->idformato)
                    );
            if (($parteformatono['cant'] + $parteformatoni['cant'] + $parteformatoab['cant']) == 0) {
                $obj->save();
                return true;
            }
            else
                return false;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF110', $ee);
        }
    }

    /**
     * Eliminar nivel de formato
     *
     * @param object $obj Objeto de tipo parte formato
     * @return boolean Retorna verdadero
     * @throws Doctrine_Exception $ee Excepción de Doctrine ocurrida durante la transacción.
     */
    public function eliminarDatParteformato($obj) 
    {

        

        try {
            $idparteformatoelim = Doctrine::getTable('DatParteFormato')->find($obj->idparteformato);
            $idparteformatoelim->delete();
            return true;
        } catch (Doctrine_Exception $ee) {
//            throw $ee;
            return false;
        }

    }

    /**
     * Modificar nivel de formato
     *
     * @param object $obj Objeto de tipo parte formato
     * @return boolean Retorna verdadero en caso de modificar los datos falso en otro caso
     * @throws Doctrine_Exception $ee Excepción de Doctrine ocurrida durante la transacción.
     */
    public function modificarDatParteformato($obj) 
    {
        try {
            $idparteformato = $obj->idparteformato;
            $nombre = $obj->nombre;
            $abreviatura = $obj->abreviatura;
            $nivel = $obj->nivel;
            $longitud = $obj->longitud;
            $idformato = $obj->idformato;
            $version = $obj->version;

            $versiono = self::Verificarversion($idparteformato);

            if ($versiono != $version)
                throw new ZendExt_Exception('CONF103');

            $formagen = $obj->buscarParteFormato(array('idparteformato' => $idparteformato, 'idformato' => $idformato));
            $valid = false;

            if ($formagen['cant'] == 1) {
                if ($formagen['datos'][0]['nombre'] != $nombre && 
                   ($formagen['datos'][0]['nivel'] == $nivel && 
                    $formagen['datos'][0]['abreviatura'] == $abreviatura)) {
                    $partformatno = $obj->buscarParteFormato(array('nombre' => $nombre, 'idformato' => $idformato));
                    if (($partformatno['cant'] == 1 && $idparteformato ==
                            $partformatno['datos'][0]['idparteformato']) ||
                            $partformatno['cant'] == 0)
                        $valid = true;
                    else
                        $valid = false;
                } elseif (
                        $formagen['datos'][0]['abreviatura'] != $abreviatura && $formagen['datos'][0]['nivel'] == $nivel
                ) {
                    $partformatab = $obj
                            ->buscarParteFormato(array('abreviatura' => $abreviatura, 'idformato' => $idformato));
                    if (($partformatab['cant'] == 1 && $idparteformato ==
                            $partformatab['datos'][0]['idparteformato']) || $partformatab['cant'] == 0)
                        $valid = true;
                    else
                        $valid = false;
                } elseif ($formagen['datos'][0]['nivel'] != $nivel) {
                    $partformatni = $obj->buscarParteFormato(
                            array('nivel' => $nivel, 'idformato' => $idformato)
                    );
                    if (($partformatni['cant'] == 1 && $idparteformato == $partformatni['datos'][0]['idparteformato'])
                            || $partformatni['cant'] == 0)
                        $valid = true;
                    else
                        $valid = false;
                } else {
                    $partformt = $obj
                            ->buscarParteFormato(
                            array(
                                'nivel' => $nivel, 'idformato'
                                => $idformato, 'nombre' => $nombre, 'abreviatura' => $abreviatura
                            )
                    );
                    if ($partformt['cant'])
                        $valid = true;
                    else
                        $valid = false;
                }
            }


            if ($valid) {
                $obj->idparteformato = $idparteformato;
                $obj->nombre = $nombre;
                $obj->abreviatura = $abreviatura;
                $obj->nivel = $nivel;
                $obj->longitud = $longitud;
                $obj->idformato = $idformato;
                $obj->version = $version;
                $obj->save();
                return true;
            }
            else
                return false;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF109', $ee);
        }
    }

    /**
     * Verificar la versión de formato
     *
     * @param int $idparteformato Identificador de nivel de formato
     * @return int Retorna la versión del formato
     * 
     */
    public function Verificarversion($idparteformato) 
    {
        $result = DatParteformato::ParteFormato('', array('idparteformato' => $idparteformato));
        return $result[0]['version'];
    }

    /**
     * Verificar si el formato esta referenciado
     *
     * @param object $obj Objeto de tipo formato
     * @return objetc Retorna un objeto de tipo formato
     * @throws Doctrine_Exception $excep
     */
    public function verificarReferenciado($obj) 
    {
        $datFormato = Doctrine::getTable('DatFormato')->find($obj->idformato);

        try {
            Doctrine::getTable('DatFormato')->createQuery()->delete()->where('idformato = ?', $obj->idformato)
                    ->execute();
        } catch (Doctrine_Exception $excep) {
            throw new ZendExt_Exception('CONF156', $excep);
        }
        $formato = new DatFormato();
        $formato->idformato = $datFormato->idformato;
        $formato->nombre = $datFormato->nombre;
        $formato->descripcion = $datFormato->descripcion;
        $formato->separador = $datFormato->separador;
        $formato->nivelpais = $datFormato->nivelpais;
        $formato->version = $datFormato->version;
        $formato->save();
        return $formato;
    }

    /**
     * Guardar colección de nivel formato
     *
     * @param array $collecion Array de parte formato
     * @param object $obj Objeto de tipo parte formato
     * @param object $formato Objeto de tipo formato
     * @throws Doctrine_Exception $ee
     */
    public function guardarColeccionDatParteFormato($colleccion, $obj = null, $formato = null) 
    {
        foreach ($colleccion as $parteFormato) {
            try {
                $datParteFormato = new DatParteformato();
                $datParteFormato->idparteformato = $parteFormato->idparteformato;
                $datParteFormato->nombre = $parteFormato->nombre;
                $datParteFormato->abreviatura = $parteFormato->abreviatura;
                $datParteFormato->nivel = $parteFormato->nivel;
                $datParteFormato->longitud = $parteFormato->longitud;
                if ($formato != null)
                    $datParteFormato->idformato = $formato->idformato;
                else
                    $datParteFormato->idformato = $parteFormato->idformato;
                $datParteFormato->version = $parteFormato->version;
                if ($obj != null) {
                    if ($parteFormato->idparteformato != $obj->idparteformato) {
                        $datParteFormato->save();
                    }
                } else {
                    $datParteFormato->save();
                }
            } catch (Doctrine_Exception $ee) {
                throw new ZendExt_Exception('CONF156', $ee);
            }
        }
    }

}
