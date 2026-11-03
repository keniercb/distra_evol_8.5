<?php

class ConfigurarFormatoNumContratoModel extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    function getFormatosNumContrato()
    {
        return NomFormatoNumContrato::getFormatoNumContrato();
    }

    function getFormatoNumContratoEntidad()
    {
        return ConfEntidadFormatoNumContrato::getFormatoNumContrato(
            $this->getIdEntidad()
        );
    }

    function getElementosIncrementales($idformato, $identiformat,
        $contratodestino
    ) {
        $elemIncr = ConfEntidadFormatoNumContrato::getElementosIncrementales(
            $idformato, $identiformat, $contratodestino
        );

        foreach ($elemIncr as &$result) {
            $result = array_merge(
                $result,
                $this->formatoElementosIncrementales(
                    $result['NomFormatoNumContratoElementoNumerico']
                )
            );
            unset($result['NomFormatoNumContratoElementoNumerico']);
        }

        return $elemIncr;
    }

    private function formatoElementosIncrementales($data)
    {
        $result = array(
            'info' => array(
                'idformatonumcontratoelemento' => $data['idformatonumcontratoelemento'],
                'longitud'                     => $data['longitud'],
                'incluircerosizquierda'        => $data['incluircerosizquierda']
            )
        );

        if (!empty($data['ConfEntidadFormatoNumContratoIncremento'])) {
            $infoEntIncr = $data['ConfEntidadFormatoNumContratoIncremento'][0];

            $valorinicial = ($data['incluircerosizquierda'] == 1)
                ? $this->rellenarIzqCeros(
                    $infoEntIncr['valorinicial'], $data['longitud']
                ) : $infoEntIncr['valorinicial'];
            $valor = ($data['incluircerosizquierda'] == 1)
                ? $this->rellenarIzqCeros(
                    $infoEntIncr['valor'], $data['longitud']
                ) : $infoEntIncr['valor'];

            $result['identidadformatonumcontratoincremento']
                = $infoEntIncr['identidadformatonumcontratoincremento'];
            $result['valorinicial'] = $valorinicial;
            $result['valor'] = $valor;
            $result['idformatonumcontratoelemento']
                = $infoEntIncr['idformatonumcontratoelemento'];
            $result['identidadformatonumcontrato']
                = $infoEntIncr['identidadformatonumcontrato'];
        }

        return $result;
    }

    private function rellenarIzqCeros($value, $length)
    {
        return str_pad($value, $length, "0", STR_PAD_LEFT);
    }

    private function getIdEntidad()
    {
        return $this->global->Estructura->idestructura;
    }

    function guardarConfigFormatoNumContratoEntidad($idformat,
        $identformatonumcont, $contratodestino, $elemIncr
    ) {
        $accion = $this->comprobarNumeroContratoEntidad($contratodestino);
        if (empty($identformatonumcont) || $accion == 'add') {
            $identformatonumcont = $this->insertarFormatoNumContratoEntidad(
                $idformat, $contratodestino
            );
        } else {
            $this->modificarFormatoNumContratoEntidad(
                $identformatonumcont, $idformat
            );
        }

        $this->actualizarElementosIncrementales(
            $identformatonumcont, $elemIncr
        );

        return $this->getFormatoNumContratoEntidad();
    }

    function insertarFormatoNumContratoEntidad($idformat, $contratodestino)
    {
        return ConfEntidadFormatoNumContrato::insertarValores(
            array(
                'identidad'            => $this->getIdEntidad(),
                'idformatonumcontrato' => $idformat,
                'contratodestino'      => $contratodestino
            )
        );
    }

    function modificarFormatoNumContratoEntidad($idformatent, $idformat)
    {
        ConfEntidadFormatoNumContrato::modificarValores(
            $idformatent, array(
                'idformatonumcontrato' => $idformat
            )
        );
    }

    function actualizarElementosIncrementales($idformatent, $elemIncr)
    {
        $elementos = json_decode($elemIncr, true);

        $isAnotherFormat = empty($elementos[0]['identidadincremento']);
        if ($isAnotherFormat) {
            ConfEntidadFormatoNumContratoIncremento::eliminarElementosIncrementalesEntidad(
                $idformatent
            );
        }

        foreach ($elementos as $elem) {

            if (empty($elem['identidadincremento'])) {
                ConfEntidadFormatoNumContratoIncremento::insertarValores(
                    array(
                        'valorinicial'                 => ($elem['valorinicial']
                            == '') ? 0 : $elem['valorinicial'],
                        'valor'                        => ($elem['valor'] == '')
                            ? 0 : $elem['valor'],
                        'idformatonumcontratoelemento' => $elem['idformato'],
                        'identidadformatonumcontrato'  => $idformatent
                    )
                );
            } else {
                ConfEntidadFormatoNumContratoIncremento::modificarValores(
                    $elem['identidadincremento'], array(
                        'valorinicial'                 => ($elem['valorinicial']
                            == '') ? 0 : $elem['valorinicial'],
                        'valor'                        => ($elem['valor'] == '')
                            ? 0
                            : $elem['valor'],
                        'idformatonumcontratoelemento' => $elem['idformato'],
                    )
                );
            }
        }
    }

    function comprobarNumeroContratoEntidad($contratodestino)
    {
        $formatos = $this->getFormatoNumContratoEntidad();
        $accion = 'add';
        $del = false;
        foreach ($formatos as $formato) {
            if ($formato['contratodestino'] == $contratodestino) {
                $accion = 'edit';
            } else {
                if ($contratodestino == 1 || $formato['contratodestino'] == 1) {
                    $del = true;
                }
            }
        }
        if ($del) {
            ConfEntidadFormatoNumContrato::delFormatoNumContrato(
                $this->getIdEntidad()
            );
        }
        return $accion;
    }
}
