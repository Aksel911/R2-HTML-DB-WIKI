class SkillTreeManager {
    constructor() {
        this.idMainWindow = '#main-window';
        this.classSkillItem = '.image-skill';
        this.allPoints = 80;
        this.availablePoints = 80;
        this.currentClass = 'knight';
        this.playerLevel = window.playerLevel || 80;
        this.skillsData = new Map();
        this.classStates = {
            knight: { points: 80, skills: new Map() },
            ranger: { points: 80, skills: new Map() },
            mage: { points: 80, skills: new Map() },
            assassin: { points: 80, skills: new Map() },
            summoner: { points: 80, skills: new Map() },
            guild: { points: 80, skills: new Map() },
            pet: { points: 80, skills: new Map() }
        };
    }

    init() {
        this.availablePoints = parseInt($('#available').attr('data-active-point'));
        Object.keys(this.classStates).forEach(className => {
            this.classStates[className].points = this.availablePoints;
        });
        this.initTabs();
        this.loadClassTrees();
        this.initEventHandlers();
        
        // window.TREE_TYPES = {
        //     4: 'Общее древо',
        //     5: 'Древо атаки рыцаря',
        //     6: 'Древо защиты рыцаря',

        //     7: 'Древо атаки рейнджера',
        //     8: 'Древо ловушек рейнджера',

        //     9: 'Древо магии мага',
        //     10: 'Древо темной магии мага',

        //     11: 'Древо боя ассасина',
        //     12: 'Древо скрытности ассасина',

        //     13: 'Древо духов призывателя',
        //     14: 'Древо тотемов призывателя',

        //     1: 'Базовое древо гильдии',
        //     2: 'Древо захвата замка',
        //     3: 'Специальное древо гильдии',

        //     15: 'Сила',
        //     16: 'Ловкость',
        //     17: 'Интеллект'

        // };
    }

    initTabs() {
        $('.classes-tabs li').on('click', (e) => {
            const $tab = $(e.currentTarget);
            if ($tab.hasClass('active')) return;
            
            // Сохраняем текущее состояние перед переключением
            this.saveCurrentState();
            
            $('.classes-tabs li').removeClass('active');
            $tab.addClass('active');
            this.currentClass = $tab.data('class');
            
            this.loadClassTrees();
        });
    }

    saveCurrentState() {
        const currentState = {
            points: this.availablePoints,
            skills: new Map()
        };

        $('.image-skill').each((_, skill) => {
            const $skill = $(skill);
            const skillId = $skill.attr('data-stn-id');
            const points = parseInt($skill.attr('data-points')) || 0;
            currentState.skills.set(skillId, points);
        });

        this.classStates[this.currentClass] = currentState;
    }

    restoreState() {
        const state = this.classStates[this.currentClass];
        if (!state) return;

        this.availablePoints = state.points;
        
        $('.image-skill').each((_, skill) => {
            const $skill = $(skill);
            const skillId = $skill.attr('data-stn-id');
            const savedPoints = state.skills.get(skillId);
            if (savedPoints !== undefined) {
                $skill.attr('data-points', savedPoints);
                this.updateSkillVisual($skill);
            }
        });

        this.updatePoints();
        this.updateTree();
    }

    async loadClassTrees() {
        try {
            this.showPreloader();
            $('.skills-list').empty();
            
            const treeIds = this.getTreeIds();
            await Promise.all(treeIds.map(id => this.loadTree(id)));
            
            // Восстанавливаем состояние после загрузки деревьев
            this.restoreState();
            
            this.renderTreeTitles();
            this.updateTree();
            this.showCurrentTrees();
        } catch (error) {
            console.error('Error loading trees:', error);
        } finally {
            this.hidePreloader();
        }
    }

    resetAllTrees() {
        $('.skill-group').each((_, group) => this.clearBranch($(group)));
        // Сбрасываем сохраненные состояния всех классов
        Object.keys(this.classStates).forEach(className => {
            this.classStates[className] = {
                points: this.allPoints,
                skills: new Map()
            };
        });
    }

    clearBranch($group) {
        const prevPoints = this.availablePoints;
        
        $group.find('.image-skill').each((_, skill) => {
            const $skill = $(skill);
            const points = parseInt($skill.attr('data-points'));
            
            if (points > 0) {
                this.availablePoints += points;
                $skill.attr('data-points', '0')
                    .removeClass('active full')
                    .find('.badge.point')
                    .text(`0/${$skill.attr('data-max-level')}`);
            }
        });
        
        // Обновляем состояние текущего класса
        this.classStates[this.currentClass].points = this.availablePoints;
        this.saveCurrentState();
        
        this.updatePoints();
        this.updateTree();
    }

    getTreeIds() {
        const skillTrees = window.SKILL_TREES;
        if (!skillTrees) {
            console.error('SKILL_TREES data not found');
            return [4];
        }

        // Get class-specific trees
        const classTrees = skillTrees[this.currentClass];
        if (!classTrees) {
            console.error(`No tree mapping found for class: ${this.currentClass}`);
            return [skillTrees.common.id];
        }

        // Guild and pet trees don't include common tree
        if (this.currentClass === 'guild' || this.currentClass === 'pet') {
            return classTrees.map(tree => tree.id);
        }

        // For other classes, combine common tree with class trees
        return [
            skillTrees.common.id,  // Add common tree ID (4)
            ...classTrees.map(tree => tree.id)  // Add class-specific tree IDs
        ];
    }

    async loadTree(treeId) {
        try {
            const response = await fetch(`/api/skill_tree/${treeId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            let $container = $(`#tree-${treeId}`);
            if (!$container.length) {
                $container = $('<div>', {
                    id: `tree-${treeId}`,
                    class: 'skills-list'
                });
                $('.skill-group[data-tree="' + treeId + '"]').append($container);
            }
    
            $container.empty();
    
            data.forEach(node => {
                this.skillsData.set(node.id.toString(), node);
            });
    
            const processedSkills = new Set();
            data.forEach(node => {
                if (!processedSkills.has(node.id.toString())) {
                    const element = this.createSkillNode(node);
                    $container.append(element);
                    processedSkills.add(node.id.toString());
                }
            });
        } catch (error) {
            console.error(`Error loading tree ${treeId}:`, error);
        }
    }

    renderTreeTitles() {
        let $treeTitles = $('.tree-titles');
        if (!$treeTitles.length) {
            $treeTitles = $('<div class="tree-titles"></div>');
            $('.skills-list').before($treeTitles);
        }

        $treeTitles.empty();

        const treeIds = this.getTreeIds();
        
        treeIds.forEach(treeId => {
            const title = window.TREE_TYPES[treeId] || '';
            $treeTitles.append(`<div>${title}</div>`);
        });

        const missingDivs = 3 - treeIds.length;
        for (let i = 0; i < missingDivs; i++) {
            $treeTitles.append('<div></div>');
        }
    }




    createSkillNode(node) {
        const existingSkill = $(`[data-stn-id="${node.id}"]`);
        const currentPoints = existingSkill.length ? 
            parseInt(existingSkill.attr('data-points')) : 0;
    
        const element = $('<div>', {
            class: 'skill-node',
            css: {
                left: `${node.position.x * 68}px`,
                top: `${node.position.y * 68}px`
            }
        });
    
        // Add arrows based on requirements before the skill div
        if (node.requirements) {
            node.requirements.forEach(req => {
                if (req.type === 'skill') {
                    const parentSkill = this.skillsData.get(req.skillId.toString());
                    if (parentSkill) {
                        this.createArrowConnections(element, node, parentSkill);
                    }
                }
            });
        }
    
        // Create the skill div
        const skillDiv = $('<div>', {
            class: 'image-skill',
            id: `skill-${node.id}`,
            'data-stn-id': node.id,
            'data-points': currentPoints,
            'data-max-level': node.maxLevel,
            'data-rows': node.position.y,
            'data-cols': node.position.x,
            'data-tree-id': node.treeId
        });
    
        // Set initial state classes
        if (node.position.y !== 1) {
            skillDiv.addClass('locked');
        }
        if (currentPoints > 0) {
            skillDiv.addClass('active');
        }
        if (currentPoints === node.maxLevel) {
            skillDiv.addClass('full');
        }
    
        // Add skill image
        $('<img>', {
            src: node.skill.iconUrl || '/static/img/trees/default-skill.png',
            alt: node.skill.name
        }).appendTo(skillDiv);
    
        // Add badge with points
        $('<div>', {
            class: 'badge point',
            text: `${currentPoints}/${node.maxLevel}`
        }).appendTo(skillDiv);
    
        // Add the skill div to the element
        element.append(skillDiv);
        return element;
    }
    
    createArrowConnections(element, currentNode, parentNode) {
        const dx = currentNode.position.x - parentNode.position.x;
        const dy = currentNode.position.y - parentNode.position.y;
        
        // Создаем контейнер для стрелок
        const arrowsContainer = $('<div>', {
            class: 'arrows-container',
            css: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 1
            }
        });
    
        // Вертикальные соединения
        if (dy !== 0) {
            const height = Math.abs(dy) * 68;
            const arrow = $('<div>', {
                class: `arrow arrow-vertical arrow-connection-vertical ${dy > 0 ? 'south' : 'north'}`
            });
    
            if (dy > 0) { // Стрелка вниз
                arrow.css({
                    height: `${height}px`,
                    top: `-${height}px`
                });
            } else { // Стрелка вверх
                arrow.css({
                    height: `${height}px`,
                    bottom: `-${height}px`
                });
            }
            arrowsContainer.append(arrow);
        }
    
        // Горизонтальные соединения
        if (dx !== 0) {
            const width = Math.abs(dx) * 68;
            const arrow = $('<div>', {
                class: `arrow arrow-horizontal arrow-connection-horizontal ${dx > 0 ? 'east' : 'west'}`
            });
    
            if (dx > 0) { // Стрелка вправо
                arrow.css({
                    width: `${width}px`,
                    left: `-${width}px`
                });
            } else { // Стрелка влево
                arrow.css({
                    width: `${width}px`,
                    right: `-${width}px`
                });
            }
            arrowsContainer.append(arrow);
        }
    
        // Добавляем контейнер со стрелками перед иконкой навыка
        element.prepend(arrowsContainer);
    }
    
    // Добавим метод для обновления состояния стрелок при изменении навыков
    updateArrowStates() {
        $('.skill-node').each((_, node) => {
            const $node = $(node);
            const $skill = $node.find('.image-skill');
            const $arrows = $node.find('.arrow');
            
            if ($skill.hasClass('active') || $skill.hasClass('full')) {
                $arrows.addClass('active');
            } else if ($skill.hasClass('locked')) {
                $arrows.addClass('locked');
            } else {
                $arrows.removeClass('active locked');
            }
        });
    }





    getTotalTreePoints(treeId) {
        let total = 0;
        $(`.skill-group[data-tree="${treeId}"] .image-skill`).each(function() {
            const points = parseInt($(this).attr('data-points') || 0);
            total += points;
        });
        return total;
    }

    checkRequirements($skill, nextLevel = false) {
        const skillData = this.getSkillData($skill);
        if (!skillData?.requirements) return true;
    
        const currentPoints = parseInt($skill.attr('data-points'));
        const maxPoints = parseInt($skill.attr('data-max-level'));
        const currentRow = parseInt($skill.attr('data-rows'));
        const isInCommonTree = $skill.closest('#tree-4').length > 0;
        const isFirstRow = currentRow === 1;
    
        // console.log('Checking requirements for:', {
        //     skillId: $skill.attr('id'),
        //     treeId: skillData.treeId,
        //     currentRow,
        //     isInCommonTree,
        //     isFirstRow
        // });
    
        if (currentPoints >= maxPoints) return false;
    
        const pointsRequirement = skillData.requirements.find(req => req.type === 'points');
        if (pointsRequirement) {
            // Проверяем общее количество очков
            if (pointsRequirement.requiredPoints > 0) {
                const totalPoints = this.getTotalAvailablePoints(skillData.treeId);
                if (totalPoints < pointsRequirement.requiredPoints) {
                    //console.log('Not enough total points');
                    return false;
                }
            }
    
            if (!isInCommonTree) {
                if (isFirstRow) {
                    // Для верхних скиллов не-общих деревьев проверяем нижнюю строку общего древа
                    const lastRowPoints = this.getCommonTreeLastRowPoints();
                    // console.log('Checking common tree last row for first row skill:', {
                    //     points: lastRowPoints,
                    //     required: 5
                    // });
                    if (lastRowPoints < 5) return false;
                } else {
                    // Для остальных скиллов проверяем предыдущую строку текущего древа
                    const previousRow = currentRow - 1;
                    const prevRowPoints = this.getTreeRowPoints(skillData.treeId, previousRow);
                    // console.log('Checking previous row in current tree:', {
                    //     row: previousRow,
                    //     points: prevRowPoints,
                    //     required: 5
                    // });
                    if (prevRowPoints < 5) return false;
                }
            }
        }
    
        return this.checkParentRequirements($skill);
    }
    
    checkParentRequirements($skill) {
        const skillData = this.getSkillData($skill);
        const currentPoints = parseInt($skill.attr('data-points'));
    
        const parentRequirements = skillData.requirements.filter(req => 
            req.type === 'skill' && req.skillId.toString() !== skillData.id.toString()
        );
    
        for (const parentReq of parentRequirements) {
            const $parentSkill = $(`[data-stn-id="${parentReq.skillId}"]`);
            if (!$parentSkill.length) {
                return false;
            }
    
            const parentPoints = parseInt($parentSkill.attr('data-points'));
            // Используем parent_level из требований
            const requiredLevel = parentReq.parent_level || 1;
    
            // console.log('Parent skill check:', {
            //     skillId: parentReq.skillId,
            //     skillName: parentReq.skillName,
            //     parentPoints,
            //     requiredLevel,
            //     currentPoints
            // });
    
            // Проверяем, достиг ли родительский скилл требуемого уровня
            if (parentPoints < requiredLevel) {
                console.log('Parent skill level too low');
                return false;
            }
        }
    
        return true;
    }

    getTotalAvailablePoints(treeId) {
        if (treeId === 4) {
            return this.getTotalTreePoints(4);
        }
        
        const commonPoints = this.getTotalTreePoints(4);
        const treePoints = this.getTotalTreePoints(treeId);
        
        return commonPoints + treePoints;
    }

    getTreeRowPoints(treeId, row) {
        let totalPoints = 0;
        $(`.skill-group[data-tree="${treeId}"] .image-skill[data-rows="${row}"]`).each(function() {
            const points = parseInt($(this).attr('data-points') || 0);
            totalPoints += points;
        });
        //console.log(`Points in tree ${treeId} row ${row}:`, totalPoints);
        return totalPoints;
    }

    getCommonTreeLastRowPoints() {
        const lastRow = 6; // последняя строка
        return this.getTreeRowPoints(4, lastRow);
    }

    getRowPoints(treeId, row) {
        let total = 0;
        let debug = [];
    
        $(`.skill-group[data-tree="${treeId}"] .image-skill`).each(function() {
            const $skill = $(this);
            const skillRow = parseInt($skill.attr('data-rows'));
            const points = parseInt($skill.attr('data-points') || 0);
            const skillId = $skill.attr('id');
            const x = parseInt($skill.attr('data-cols'));
            const y = parseInt($skill.attr('data-rows'));
    
            debug.push({skillId, row: skillRow, targetRow: row, points, x, y});
    
            if (skillRow === row) {
                total += points;
            }
        });
    
        // console.log('Debug getRowPoints:', {
        //     treeId,
        //     targetRow: row,
        //     foundSkills: debug,
        //     total
        // });
    
        return total;
    }
    
    showTooltip($skill) {
        const skillData = this.getSkillData($skill);
        if (!skillData) return;
    
        const currentPoints = parseInt($skill.attr('data-points'));
        const maxPoints = parseInt($skill.attr('data-max-level'));
        const currentLevel = skillData.levels[currentPoints];
        const currentRow = parseInt($skill.attr('data-rows'));
        const isInCommonTree = $skill.closest('#tree-4').length > 0;
        const isFirstRow = currentRow === 1;
        
        const skillActiveType = currentLevel.skill_active_or_no === 1 ? 'Активный' : 'Пассивный';
        
        let requirementsHtml = '';
    
        if (currentPoints < maxPoints) {
            const requirements = [];
    
            if (skillData.requirements) {
                const pointsReq = skillData.requirements.find(req => req.type === 'points');
                if (pointsReq) {
                    // Общие очки
                    if (pointsReq.requiredPoints > 0) {
                        const totalPoints = this.getTotalAvailablePoints(skillData.treeId);
                        const text = `Требуется ${pointsReq.requiredPoints} очков всего (текущее: ${totalPoints})`;
                        requirements.push({
                            text,
                            isMet: totalPoints >= pointsReq.requiredPoints
                        });
                    }
    
                    // Проверяем требования по очкам в зависимости от положения скилла
                    if (!isInCommonTree) {
                        if (isFirstRow) {
                            // Для верхних скиллов не-общих деревьев
                            const lastRowPoints = this.getCommonTreeLastRowPoints();
                            const text = `Требуется 5 очков в последней строке общего древа (текущее: ${lastRowPoints})`;
                            requirements.push({
                                text,
                                isMet: lastRowPoints >= 5
                            });
                        } else {
                            // Для остальных скиллов
                            const previousRow = currentRow - 1;
                            const prevRowPoints = this.getTreeRowPoints(skillData.treeId, previousRow);
                            const text = `Требуется 5 очков в предыдущей строке текущего древа (текущее: ${prevRowPoints})`;
                            requirements.push({
                                text,
                                isMet: prevRowPoints >= 5
                            });
                        }
                    }
                }
    
                // Проверяем родительские требования
                const parentRequirements = skillData.requirements.filter(req => 
                    req.type === 'skill' && req.skillId.toString() !== skillData.id.toString()
                );
    
                for (const parentReq of parentRequirements) {
                    const $parentSkill = $(`[data-stn-id="${parentReq.skillId}"]`);
                    if ($parentSkill.length) {
                        const parentPoints = parseInt($parentSkill.attr('data-points'));
                        const parentBaseName = parentReq.skillName.replace(/\sур\.\s\d+$/, '');
                        const requiredLevel = parentReq.parent_level || 1;
                        const text = `Требуется навык "${parentBaseName}" ур. ${requiredLevel}`;
                        requirements.push({
                            text,
                            isMet: parentPoints >= requiredLevel
                        });
                    }
                }
            }
    
            // Проверяем требование уровня персонажа
            if (currentLevel.use_level) {
                requirements.push({
                    text: `Требуемый уровень персонажа: ${currentLevel.use_level}`,
                    isMet: (window.playerLevel || 80) >= currentLevel.use_level
                });
            }
    
            if (requirements.length > 0) {
                requirementsHtml = `
                    <div class="tooltip-requirements">
                        Требования для уровня ${currentPoints + 1}:
                        ${requirements.map(req =>
                            `<div class="requirement ${req.isMet ? 'met' : 'unmet'}">${req.text}</div>`
                        ).join('')}
                    </div>
                `;
            }
        }
    
        $('.skill-tooltip').remove();
    
        const tooltip = $('<div>', {
            class: 'skill-tooltip',
            html: `
                <div class="tooltip-header">
                    <div class="tooltip-title">${currentLevel.name}</div>
                    <div class="tooltip-type">${skillActiveType}</div>
                </div>
                <div class="tooltip-body">
                    <div class="tooltip-description">${currentLevel.description}</div>
                    ${currentLevel.use_level ? 
                        `<div class="tooltip-use-level">Требуемый уровень: ${currentLevel.use_level}</div>` : ''}
                    ${requirementsHtml}
                </div>
            `
        }).hide();
    
        $('body').append(tooltip);
    
        const offset = $skill.offset();
        let left = offset.left + $skill.outerWidth() + 10;
        if (left + tooltip.outerWidth() > $(window).width()) {
            left = offset.left - tooltip.outerWidth() - 10;
        }
    
        tooltip.css({
            left: left,
            top: offset.top
        }).fadeIn(200);
    }

    getSkillData($skill) {
        const skillId = $skill.attr('data-stn-id');
        return this.skillsData.get(skillId);
    }

    updateTree() {
        $('.image-skill').each((_, skill) => {
            const $skill = $(skill);
            const skillData = this.getSkillData($skill);
            if (!skillData) return;

            const currentPoints = parseInt($skill.attr('data-points'));
            const maxPoints = parseInt($skill.attr('data-max-level'));

            $skill.removeClass('locked active full available');

            if (currentPoints === maxPoints) {
                $skill.addClass('full');
                return;
            }

            if (currentPoints > 0) {
                $skill.addClass('active');
            }

            if (this.availablePoints > 0 && this.checkRequirements($skill)) {
                $skill.addClass('available');
            } else {
                $skill.addClass('locked');
            }
        });
    }
    
    updateSkillVisual($skill) {
        const currentPoints = parseInt($skill.attr('data-points'));
        const maxPoints = parseInt($skill.attr('data-max-level'));
        
        $skill.attr('data-points', currentPoints);
        $skill.find('.badge.point').text(`${currentPoints}/${maxPoints}`);
        
        // Обновляем классы состояния
        $skill.removeClass('locked active full');
        if (currentPoints === maxPoints) {
            $skill.addClass('full');
        } else if (currentPoints > 0) {
            $skill.addClass('active');
        }
    
        // Проверяем требования для следующих навыков
        if (!this.checkRequirements($skill)) {
            $skill.addClass('locked');
        }
    }

    upgradeSkill($skill) {
        const skillData = this.getSkillData($skill);
        
        if (!skillData || this.availablePoints <= 0 || !this.checkRequirements($skill)) {
            return false;
        }

        this.applyUpgrade($skill);
        return true;
    }

    applyUpgrade($skill) {
        const currentPoints = parseInt($skill.attr('data-points'));
        const newPoints = currentPoints + 1;
        
        $skill.attr('data-points', newPoints);
        this.availablePoints--;
        
        this.updateSkillVisual($skill);
        this.updatePoints();
        this.updateTree();
        this.showTooltip($skill);
    }

    downgradeSkill($skill) {
        const currentPoints = parseInt($skill.attr('data-points'));
        if (currentPoints <= 0) return;

        const hasBlockingDependentSkills = this.hasBlockingDependentSkills($skill);

        if (hasBlockingDependentSkills) {
            alert('Нельзя понизить уровень: есть зависимые навыки с очками');
            return;
        }

        $skill.attr('data-points', currentPoints - 1);
        this.availablePoints++;

        this.updateSkillVisual($skill);
        this.updatePoints();
        this.updateTree();
        this.showTooltip($skill);
    }

    hasBlockingDependentSkills($skill) {
        const skillId = $skill.attr('data-stn-id');
        const currentPoints = parseInt($skill.attr('data-points'));
        let hasBlocking = false;

        $('.image-skill').each((_, el) => {
            const $dependent = $(el);
            if ($dependent.attr('data-stn-id') === skillId) return;

            const dependentData = this.getSkillData($dependent);
            const dependentPoints = parseInt($dependent.attr('data-points'));

            if (dependentPoints > 0 && dependentData?.requirements) {
                const skillRequirement = dependentData.requirements.find(req =>
                    req.type === 'skill' && req.skillId.toString() === skillId
                );

                if (skillRequirement && dependentPoints > 0 && currentPoints <= dependentPoints) {
                    hasBlocking = true;
                    return false;
                }
            }
        });

        return hasBlocking;
    }

    getLastRowPoints(row) {
        let totalPoints = 0;
        const lastRow = 6;
        
        if (row <= 1) {
            row = lastRow;
        }
        
        const $skills = $(`.skill-group[data-tree="4"] .image-skill[data-rows="${row - 1}"]`);
        
        $skills.each((_, skill) => {
            const $skill = $(skill);
            const points = parseInt($skill.attr('data-points') || 0);
            
            totalPoints += points;
        });
        
        return totalPoints;
    }

    initEventHandlers() {
        $(document).on('click', '.image-skill', (e) => {
            e.preventDefault();
            const $skill = $(e.currentTarget);
            if (!$skill.hasClass('locked')) {
                this.upgradeSkill($skill);
                this.showTooltip($skill);
            }
        });

        $(document).on('contextmenu', '.image-skill', (e) => {
            e.preventDefault();
            const $skill = $(e.currentTarget);
            this.downgradeSkill($skill);
        });

        let currentTooltipSkill = null;

        $(document).on('mouseenter', '.image-skill', (e) => {
            const $skill = $(e.currentTarget);
            this.showTooltip($skill);
            currentTooltipSkill = $skill;
        });

        $(document).on('mouseleave', '.image-skill', () => {
            $('.skill-tooltip').fadeOut(200, function() {
                $(this).remove();
            });
            currentTooltipSkill = null;
        });

        const updateTooltipIfHovering = () => {
            if (currentTooltipSkill && currentTooltipSkill.length) {
                this.showTooltip(currentTooltipSkill);
            }
        };

        const originalUpdateTree = this.updateTree;
        this.updateTree = function(...args) {
            originalUpdateTree.apply(this, args);
            updateTooltipIfHovering();
        };

        const originalUpdateSkillVisual = this.updateSkillVisual;
        this.updateSkillVisual = function(...args) {
            originalUpdateSkillVisual.apply(this, args);
            updateTooltipIfHovering();
        };

        $('.trees-btn-long').on('click', (e) => {
            this.clearBranch($(e.currentTarget).closest('.skill-group'));
        });

        $('#clear-tree').on('click', () => this.resetAllTrees());
    }

    updatePoints() {
        $('#available').text(this.availablePoints);
    }

    showPreloader() {
        $('.preloader, .preloader-bg').show();
    }

    hidePreloader() {
        $('.preloader, .preloader-bg').hide();
    }

    showCurrentTrees() {
        $('.skill-group').hide();
        
        const treeIds = this.getTreeIds();
        
        treeIds.forEach(id => {
            $(`.skill-group[data-tree="${id}"]`).show();
        });
        
        this.renderTreeTitles();
    }
}

// Инициализация
$(document).ready(() => {
    window.skillTree = new SkillTreeManager();
    window.skillTree.init();
});