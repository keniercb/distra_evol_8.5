<?php

/**
 * Interfaz para la gestion de documentos
 *
 * @author Kenier Cumba Bueno
 */
interface IDocumentoController
{

    /**
     *
     */
    public function adicionarDocumentoAction();

    /**
     *
     */
    public function cargarDocumentosAction();

    /**
     *
     */
    public function eliminarDocumentoAction();

    /**
     *
     */
    public function confirmarDocumentoAction();

    /**
     *
     */
    public function anularEstadoDocumentoAction();

    /**
     *
     */
    public function aprobarEstadoDocumentoAction();

    /**
     *
     */
    public function cargarProductosDocumentoAction();

    /**
     *
     */
    public function cancelarDocumentoAction();

    /**
     *
     */
    public function copiarDocumentoAction();
}
