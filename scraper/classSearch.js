:find out why the serach might be making my program hang


function execute_search(searchType) {

            var errors = [];
            var txterrors = '';
            valid = true;

            // Add values to this data structure if field is required
            var data = {};
            data[window.csrfToken] = $.cookie(window.csrfCookie);

            // Show errors if fields are required or in 'options' (determined by configuration), but contain no entry

            // Term is always required, so no need to check its configuration
            if ($('#term').val() == '') {
                errors.push('Please select ' + classSearchFields.strm.descr + '.\n');
                valid = false;
            }
            else {
                data['term'] = $('#term').val();
            }

            if (classSearchFields.date_range.use != 'none') {
                // If it's required, start and end date must have values
                if (classSearchFields.date_range.required) {
                    if ($('#start-dt').val() == '' || $('#end-dt').val() == '') {
                        errors.push('Please select a from and to start date. \n');
                        valid = false;
                    }
                }
                else {
                    if ($('#start-dt').val() != '' && $('#end-dt').val() == '') {
                        errors.push('Please select a to start date. \n');
                        valid = false;
                    }
                    else if ($('#start-dt').val() == '' && $('#end-dt').val() != '') {
                        errors.push('Please select a from start date. \n');
                        valid = false;
                    }
                }

                data.start_dt = $('#start-dt').val();
                data.end_dt = $('#end-dt').val();

                var parsedStartDate = Date.parse($('#start-dt').val());
                var parsedEndDate = Date.parse($('#end-dt').val());

                if (parsedEndDate < parsedStartDate) {
                    errors.push('To start date cannot be earlier than From start date. \n');
                    valid = false;
                }

            }

            if (classSearchFields.subject.use === 'options') {
                if (classSearchFields.subject.required && $('#subject').val() == 'dummy') {
                    errors.push('Please select ' + classSearchFields.subject.descr + '.\n');
                    valid = false;
                }
            }

            if (classSearchFields.catalog_nbr.use === 'options') {
                if (classSearchFields.catalog_nbr.required && $('#catalog-nbr').val() == '') {
                    errors.push('Please enter ' + classSearchFields.catalog_nbr.descr + '.\n');
                    valid = false;
                }
            }

            if (classSearchFields.days.use === 'options') {
                if (classSearchFields.days.required && $('#search-days input:checkbox:checked').length == 0) {
                    errors.push('Please select at least one day. \n');
                    valid = false;
                }
                else {
                    data['days'] = [];
                    $('[id^="days-checkbox"]').each( function () {
                        var $this = $(this);
                        if ($this.is(':checked')) {
                            data['days'].push($this.val());
                        }
                    });
                    data['days'] = data['days'].join(',');
                }
            }

            if (classSearchFields.time_range.use === 'options') {
                if (classSearchFields.time_range.required && $('#search-time-range').val() == "0,23.5") {
                    errors.push('Please select a more limited time range. \n');
                    valid = false;
                }
                else {
                    data['time_range'] = $('[id$=-time-range]').val();
                }
            }

            if (classSearchFields.campus.use === 'options') {
                if (classSearchFields.campus.required && $('[id$=-campus]').val() == '') {
                    errors.push('Please select ' + classSearchFields.campus.descr + '.\n');
                    valid = false;
                }
                else {
                    data['campus'] = $('[id$=-campus]').val();
                }
            }

            if (classSearchFields.location.use === 'options') {
                if (classSearchFields.location.required && $('[id$=-location]').val() == '') {
                    errors.push('Please select ' + classSearchFields.location.descr + '.\n');
                    valid = false;
                }
                else {
                    data['location'] = $('[id$=-location]').val();
                }
            }

            /* Begin: NYU0233221_20150723_cm3762_Class Search Location */
            if (classSearchFields.nyu_location.use != 'none' && classSearchFields.nyu_location.required) {
                if ($('[id*=-nyu-location]').val() == '') {
                    errors.push('Please select ' + classSearchFields.nyu_location.descr + '.\n');
                    valid = false;
                }
                else{
                    data['nyu_location'] = $('[id*=-nyu-location]').val();
                }
            }
            /* End: NYU0233221_20150723_cm3762_Class Search Location */

            if (classSearchFields.career.use === 'options') {
                if (classSearchFields.career.required && $('[id$=-career]').val() == '') {
                    errors.push('Please select ' + classSearchFields.career.descr + '.\n');
                    valid = false;
                }
                else {
                    data['acad_career'] = $('[id$=-career]').val();
                }
            }

            if (classSearchFields.acad_group.use === 'options') {
                if (classSearchFields.acad_group.required && $('[id$=-acad-group]').val() == '') {
                    errors.push('Please select ' + classSearchFields.acad_group.descr + '.\n');
                    valid = false;
                }
                else {
                    data['acad_group'] = $('[id$=-acad-group]').val();
                }
            }

            if (classSearchFields.req_designation.use === 'options') {
                if (classSearchFields.req_designation.required && $('[id$=-req-des]').val() == '') {
                    errors.push('Please select ' + classSearchFields.req_designation.descr + '.\n');
                    valid = false;
                }
                else {
                    data['rqmnt_designtn'] = $('[id$=-req-des]').val();
                }
            }

            if (classSearchFields.instruct_mode.use === 'options') {
                if (classSearchFields.instruct_mode.required && $('[id$=-instruct-mode]').val() == '') {
                    errors.push('Please select ' + classSearchFields.instruct_mode.descr + '.\n');
                    valid = false;
                }
                else {
                    data['instruction_mode'] = $('[id$=-instruct-mode]').val();
                }
            }

            if (classSearchFields.keyword.use === 'options') {
                if (classSearchFields.keyword.required && $('#keyword').val() == '') {
                    errors.push('Please enter ' + classSearchFields.keyword.descr + '.\n');
                    valid = false;
                }
            }

            if (classSearchFields.class_nbr.use === 'options') {
                if (classSearchFields.class_nbr.required && $('#class-nbr').val() == '') {
                    errors.push('Please enter ' + classSearchFields.class_nbr.descr + '.\n');
                    valid = false;
                }
            }

            if (classSearchFields.acad_org.use === 'options') {
                if (classSearchFields.acad_org.required && $('[id$=-acad-org]').val() == '') {
                    errors.push('Please select ' + classSearchFields.acad_org.descr + '.\n');
                    valid = false;
                }
                else {
                    data['acad_org'] = $('[id$=-acad-org]').val();
                }
            }

            if (classSearchFields.course_attr.use === 'options') {
                if (classSearchFields.course_attr.required && $('[id$=-crse-attr]').val() == '') {
                    errors.push('Please select ' + classSearchFields.course_attr.descr + '.\n');
                    valid = false;
                }
                else {
                    data['crse_attr'] = $('[id$=-crse-attr]').val();
                }
            }

            if (classSearchFields.course_attr_val.use === 'options') {
                if (classSearchFields.course_attr_val.required && $('[id$=-crse-attr-value]').val() == '') {
                    errors.push('Please select ' + classSearchFields.course_attr_val.descr + '.\n');
                    valid = false;
                }
                else {
                    data['crse_attr_value'] = $('[id$=-crse-attr-value]').val();
                }
            }

            if (classSearchFields.instructor_name.use === 'options') {
                if (classSearchFields.instructor_name.required && $('#instructor-name').val() == '') {
                    errors.push('Please enter ' + classSearchFields.instructor_name.descr + '.\n');
                    valid = false;
                }
            }

            if (classSearchFields.session.use === 'options') {
                if (classSearchFields.session.required && $('[id$=-session]').val() == 'dummy') {
                    errors.push('Please select ' + classSearchFields.session.descr + '.\n');
                    valid = false;
                }
                else {
                    data['session_code'] = $('[id$=-session]').val();
                }
            }

            if (classSearchFields.enrl_stat.use === 'options') {
                if ($('[id$=-enrl-stat]:checked').length > 0) {
                    data['enrl_stat'] = $('[id$=-enrl-stat]:checked').val();
                }
            }

            // Keyword, subject, catalog number and class number will always be sent as params and not saved to |data|
            data['subject']         = $('#subject').val();
            data['catalog_nbr']     = $('#catalog-nbr').val();
            data['keyword']         = $('#keyword').val();
            data['class_nbr']       = $('#class-nbr').val();
            data['instructor_name'] = $('#instructor-name').val();
            /* Begin: NYU0233221_20150723_cm3762_Class Search Location */
            data['nyu_location']    = $('[id*=-nyu-location]').val();
            /* End: NYU0233221_20150723_cm3762_Class Search Location */

            // don't send subject='dummy' or session='dummy'
            if (data['subject'] === 'dummy') data['subject'] = '';
            if (data['session_code'] === 'dummy') data['session_code'] = '';

            if (!valid) {
                txterrors += errors.join('');
                alert(txterrors);
            }
            else {

                $('#search-results').show();

                if (searchType == 'full') {
                    
                    $.ajax({
                        beforeSend : showLoading,
                        url: searchURL,
                        type: 'POST',
                        cache: true,
                        data: data,
                        success: function( data ) {
                            hideLoading();

                            $('#search-results').html(data);
                            apply_filters();

                            update_classes_found();

                            // Scroll to results if on mobile
                            if ($.browser.mobile == true) {
                                setTimeout( function() {
                                    $('section.main section').animate({
                                        scrollTop: $('#search-results').offset().top - $('#search-controls').offset().top
                                    }, 'slow');
                                }, 0);
                            }

                            cache_search_options();

                        }
                    });
                }
                else if (searchType == 'simple') {

                    // Simpler ajax call to just refresh the search, with no forced scrolling or caching
                    $.ajax({
                        beforeSend : showLoading,
                        url: searchURL,
                        type: 'POST',
                        cache: true,
                        data: data,
                        success: function( data ) {
                            hideLoading();

                            $('#search-results').html(data);
                            apply_filters();

                            update_classes_found();

                            // Do scrolling only if coming from class details
                                if ($.browser.mobile == true) {
                                    setTimeout( function() {
                                        $('section.main section').animate({
                                            scrollTop: $('#search-results').offset().top - $('#search-controls').offset().top
                                        }, 'slow');
                                    }, 0);
                                }
                        }
                    });

                }
            }

            return false;
        }
