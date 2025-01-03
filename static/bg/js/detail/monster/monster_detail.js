// TODO: Пока скелет для применения в дальнейшем (Динамически будет подгружать данные о монстре)

$(document).ready(function() {
    const monsterId = $('body').data('monster-id'); // Получаем ID монстра из шаблона

    // Загружаем основную информацию
    $.get(`/monster/${monsterId}/basic-info`, function(data) {
        $('#basic-info').html(data);
    });

    // Загружаем информацию о локации
    $.get(`/monster/${monsterId}/location-info`, function(data) {
        $('#location-info').html(data);
    });

    // Загружаем данные о сопротивлениях к аномалиям
    $.get(`/monster/${monsterId}/abnormal-resist`, function(data) {
        $('#abnormal-resist').html(data);
    });

    // Загружаем данные AI
    $.get(`/monster/${monsterId}/ai-data`, function(data) {
        $('#ai-data').html(data);
    });

    // Загружаем данные AIEx
    $.get(`/monster/${monsterId}/aiex-data`, function(data) {
        $('#aiex-data').html(data);
    });

    // Загружаем статистику
    $.get(`/monster/${monsterId}/stats-info`, function(data) {
        $('#stats-info').html(data);
    });

    // Загружаем данные о защите
    $.get(`/monster/${monsterId}/protect-data`, function(data) {
        $('#protect-data').html(data);
    });

    // Загружаем данные о поражении
    $.get(`/monster/${monsterId}/slain-data`, function(data) {
        $('#slain-data').html(data);
    });

    // Загружаем данные о добавляемых атрибутах
    $.get(`/monster/${monsterId}/attribute-add-data`, function(data) {
        $('#attribute-add-data').html(data);
    });

    // Загружаем данные о сопротивлениях к атрибутам
    $.get(`/monster/${monsterId}/attribute-resist-data`, function(data) {
        $('#attribute-resist-data').html(data);
    });

    // Загружаем список выпадающих предметов
    $.get(`/monster/${monsterId}/drop-items`, function(data) {
        $('#drop-items').html(data);
    });

    // Загружаем список продаваемых предметов
    $.get(`/monster/${monsterId}/sell-items`, function(data) {
        $('#sell-items').html(data);
    });
});